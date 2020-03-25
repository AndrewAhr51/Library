const mongoose = require("mongoose");

const coverImageBasePath = "uploads/bookCovers";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Author"
  },
  genre: {
    type: String,
    required: true
  },
  coverImageName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  pageCount: {
    type: Number,
    required: true
  },
  publishedDate: {
    type: Date,
    required: true,
    default: Date.now()
  },
  read: {
    type: String,
    required: true,
    default: "false"
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
