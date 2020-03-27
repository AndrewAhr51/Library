const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");

// All books
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
router.post("/", async (req, res) => {
    const book = new Book ({
        title: req.body.title,
        description: req.body.description,
        read: req.body.read,
        genre: req.body.genre,
        pageCount: req.body.pageCount,
        author: req.body.author,
        cover: null,
        publishedDate: new Date(req.body.publishedDate)
    })

    try{
        const newBook = await book.save()
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
        if(hasError) params.errorMessage= 'Error creating book'
        res.render('books/new', params)
    }

}
module.exports = router;
