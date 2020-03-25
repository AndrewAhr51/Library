const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const Book = require("../models/book");
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

    let searchOptions = {};
    if(req.query.name != null && req.query.name != ' '){
        searchOptions = { "$regex": req.query.name, "$options": "i" }
        console.log(searchOptions);
    }

    try{
       const books = await Books.find({})
        res.render("books/index",{ books: books,
            searchOptions:req.query});
    }catch (err) {

        res.redirect('/')
    }
});

//new book route
router.get('/new', async(req, res) => {
//    renderNewPage(res,newBook())
   try{
        const authors= await Author.find({})
        const book = new Book()
        res.render('books/new',{
            authors:authors,
            book:book
        })
    } catch{
        res.redirect('/books')
    }
    
});

//Create book route
router.post('/', upload.single('cover'), async(req, res) =>{
    const fileName = req.file != null ? req.file.filename: null
    const book = new Book ({
        title: req.body.title,
        author:req.body.author,
        genre:req.body.genre,
        datePublished: new Date(req.body.publishedDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName,
        read:req.body.read,
    })
    try {
        const newBook = await book.save();
        //res.redirect(\books/${newBook.id}`)
        res.redirect(`books`);
    } catch {
        if (book.coverImageName!= null) {
            removeBookCover(book.cover.coverInageName)
        }

        renderNewPage(res, book, true)

        

//        res.redirect(`books`);    
    }
});


function removeBookCover(fileName) {
   fs.unlink(path.join(upload, filName, err=>{
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
        res.redirect('/books');
    }
}

module.exports = router;

