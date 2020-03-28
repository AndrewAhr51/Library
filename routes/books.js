const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const imageMimeTpes =['image/jpeg', 'image.png', 'image.gif']

// All books route
router.get("/", async (req, res) => {

  let query = Book.find()
  if (req.query.name !=null && req.query.name != '' ){
    query= query.regex('name', new RegExp(req.query.name, 'i'))
  } 

  try{
      const books = await query.exec()
      res.render("books/index",{ books: books,
          searchOptions:req.query});
  }catch (err) {
      res.redirect('/books')
  }
  
});

// New Book
router.get("/new", async (req, res) => {
    renderNewPage(res,req, false)
}); 

// Create book
router.post("/",  async (req, res) => {
    const book = new Book ({
        title: req.body.title,
        description: req.body.description,
        read: req.body.read,
        genre: req.body.genre,
        pageCount: req.body.pageCount,
        author: req.body.author,
        coverImageName: null,
        publishedDate: new Date(req.body.publishedDate)
    })

    // saveCover(book, req.body.cover)

    try{
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect('/books')
    } catch (err) {
        renderNewPage(res, book, true)  
    }
});

async function renderNewPage(res, book, hasError = false) {

    try{
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book,
        }
        if(hasError) params.errorMessage= 'Error creating book'

        res.render('books/new', params)
    } catch {
        res.render('books')
    }
}

router.get('/:id', async (req, res) => {
    try{
        const book = await Book.findById(req.params.id)
                                     .populate('author')
                                    .exec()
        res.render('book/Show',{book:book})                     
        
    } catch {
        res.redirect('/')
    }
})

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router;
