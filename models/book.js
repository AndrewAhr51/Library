const mongoose = require("mongoose");

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
  coverImage: {
    type: Buffer,
  },
  coverImageType: {
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
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType}; charset=utf-8;base64, ${this.coverImage.toString(base64)}`
  }
})

module.exports = mongoose.model("Book", bookSchema);
