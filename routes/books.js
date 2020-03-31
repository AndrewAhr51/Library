const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const imageMimeTpes = ["image/jpeg", "image.png", "image.gif"];

// New Book
router.get("/new", async (req, res) => {
  const book = new Book();
  renderNewPage(res, req, book, false);
});

// Create book
router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    description: req.body.description,
    read: req.body.read,
    genre: req.body.genre,
    pageCount: req.body.pageCount,
    author: req.body.author,
    coverImagePath: null,
    publishedDate: new Date(req.body.publishedDate)
  });

  saveCover(book, req.body.cover);

  try {
    const newBook = await book.save();
    res.redirect(`books/${newBook.id}`);
  } catch (err) {
    renderNewPage(res, book, true);
  }
});

// All books route
router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }

  try {
    const books = await query.exec();
    res.render("books/index", { books: books, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

//Show book route
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("author")
      .exec();
    const author = await Author.find(book.author);

    res.render("books/show", { book: book });
  } catch {
    res.redirect("/");
  }
});

// Edit book route
router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    .populate("author")
    .exec();

    renderEditPage(res, book);
  } catch {
    res.redirect("/");
  }
});

// Update  book route
router.put("/:id", async (req, res) => {

  let book;
  let author

  try {
    const book = await Book.findById(req.params.id)
    .populate("author")
    .exec();
    
    console.log(book);

    book.title = req.body.title;
    book.author = req.body.author
    book.publishedDate = new Date(req.body.publishedDate);
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    book.genre = req.body.genre;
    book.read = req.body.read;

   /*  if (req.body.coverImagePath != null && req.body.coverImagePath !== '') {
      saveCover(book, req.body.cover);
    } */

    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch {
    if (book !== null) {
      renderEditPage(res, book, "edit", true);
    }
    redirect("/");
  }
});

router.delete('/:id', async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id)
    book.remove()
    res.redirect('/books')
  } catch{
    if( book !== null) {
     book = await Book.findById(req.params.id)
    .populate("author")
    .exec();
      res.render('books/show'),{
        book: book,
        errorMessage:'Could not remove book'
      }
    } else {
      res.redirect('/');
    }
  }
})

async function renderNewPage(res, book, author, hasError = false) {
    renderFormPage(res, book, "new", hasError);
}

async function renderEditPage(res, book, hasError = false) {
  renderFormPage(res, book, "edit", hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book
    };
    if (hasError){
      if (form == 'edit') {
        params.errorMessage = "Error Updating  the book";
      } else{
        params.errorMessage = "Error Creating  the book";
      }
    }
    
    res.render(`books/${form}`, params);
  } catch {
    res.render("/books");
  }
}

function saveCover(book, coverEncoded) {
  /* if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  } */
}

module.exports = router;
