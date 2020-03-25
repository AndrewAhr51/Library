const coverImageBasePath = 'uploads/bookCovers';

const mongoose = require("mongoose");
const path = require("path")

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
    type: String
  },
  description: {
    type: String
  },
  pageCount: {
    type: Number,
    required: true
  },
  publishDate: {
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
  },
});

bookSchema.virtual('coverImagePath').get(function () {
  if (this.coverImageName != null) {
    return path.join('/', coverImageBasePath, this.coverImageName )
  }
})

module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
