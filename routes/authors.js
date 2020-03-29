const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

// New authors screen
router.get("/new", async (req, res) => {
  res.render("authors/new", { author: new Author() });
});

// Create author route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name
  });

  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating Author..."
    });
  }
});

// All authors route
router.get("/", async (req, res) => {
  let query = Author.find();
  if (req.query.name != null && req.query.name != "") {
    query = query.regex("name", new RegExp(req.query.name, "i"));
  }

  try {
    const authors = await query.exec();
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

// Show Author by ID
router.get("/:id/", async (req, res) => {
  
   try {
    const author = await Author.findById(req.params.id);
    const books = await Book.find({ author: author.id }).limit(6).exec();
    
    res.render("authors/show", {
      author: author,
      booksByAuthor: books
    });
  } catch {
    res.render("authors/", { authors: authors, searchOptions: req.query });
  }
});

// Edit Author
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});

// Author update
router.put("/:id", async (req, res) => {
  let author;

  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();

    res.redirect(`/authors/${author.id}`);
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("/authors/edit", {
        author: author,
        errorMessage: "Error updating Author..."
      });
    }
  }
});

//Delete Author...
router.delete("/:id", async (req, res) => {
  let author = new Author({
    name: req.body.name
  });

  author = req.params.id;
  try {
    let book = await Book.findOne({ author });

    if (book == null) {
      await Author.findByIdAndRemove(req.params.id,{useFindAndModify:false});
      res.redirect("/authors");
    } else {
      res.redirect(405, "/authors", { author:author,
        errorMessage: `Not allowed, ${author.name}, still has books in inventory ` });
    }
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render(`/,${author.id}`);
    }
  }
});

module.exports = router;
