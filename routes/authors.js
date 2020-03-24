const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// All authors
router.get("/", async (req, res) => {
    /* let searchOptions = {};
    if(req.query.name != null && req.query.name != ' '){
        searchOptions.name = new RegExp(req.query.name, 'i')
        console.log(searchOptions);
    } */

    let searchOptions = {};
    if(req.query.name != null && req.query.name != ' '){
        searchOptions = { "$regex": req.query.name, "$options": "i" }
        console.log(searchOptions);
    }

    try{
       const authors = await Author.find({})
        res.render("authors/index",{ authors: authors,
            searchOptions:req.query});
    }catch (err) {

        res.redirect('/')
    }
  
});

// New authors
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
}); 

// Create authors
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name
  });

  try {
    const newAuthor = await author.save()
    res.redirect(`authors`);
  } catch {
    res.render("authors/new", {
        author: author,
        errorMessage: "Error creating Author..."
    });
  }
});

module.exports = router;
