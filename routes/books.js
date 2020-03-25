const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");
const path = require("path");
const fs = require('fs');
const hasError = false;

const multer = require("multer");
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['images/jpeg','images/png', 'images/gif']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
   }
})

// All books route
router.get('/', async(req, res) =>{
    let query= Book.find()
    if (req.query.title !=null && req.query.title != '' ){
        query= query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore !=null && req.query.publishedBefore != '' ){
        query= query.lte('publishDate', req.query.publishedDate)
    }
    if (req.query.publishedAfter !=null && req.query.publishedAfter != '' ){
        query= query.gte('publishDate', req.query.publishedDate)
    }

    try{
       const books = await query.exec()
        res.render("books/index",{
            books: books,
            searchOptions: req.query});
    }catch (err) {
        res.redirect('/')
    }
});

//new book route
router.get('/new', async(req, res) => {

  try {
        const authors= await Author.find({})
        const book = new Book()
        res.render('books/new', {
            authors:authors,
            book:book
        })
    } catch{
        removeBookCover(book.coverImageName)
        res.redirect('/books/new')
    } 
    
});

//Create book route
router.post('/', upload.single('cover'), async (req, res) =>{
    
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book ({
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        datePublished: new Date(req.body.publishedDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName,
        read: req.body.read,
    })
    try {
        const newBook = await book.save();
        console.log(newBook);
        //res.redirect(\books/${newBook.id}`)
        res.redirect('/books');
    } catch (err) {
        console.log(err);
        if (book.coverImageName!= null) {
            removeBookCover(book.cover.coverImageName)
        }
        res.redirect('/books/new')
    }
});


function removeBookCover(fileName) {
   fs.unlink(path.join(upload, filName, err =>{
      if (err) console.error(err)
       })
   )}

async function renderNewPage(res, book, hasEerror = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors:authors,
            book: book
        }
        
        if (hasError) params.errorMessage = 'Error creating book...'
    
        res.render('books/new', params);
    } catch (err) {
        console.log(err)
        res.redirect('/books/new')
    }
}

module.exports = router;

