const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishedDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true    
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now    
  },
  coverImagePath: {
    type: Buffer
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'    
  },
  genre: {
      type: String,
      required: true
  },
  read: {
      type: Boolean,
      default: false
  }
})

/* bookSchema.virtual('coverImagePath').get(function(){
  if(this.coverImage !=null && this.coverImageType !=null) {
    return `data: ${this.coverImageType};charset=utf-8; base64,
      ${this.coverImageType.toString(base64)}`
  }
})
 */
module.exports = mongoose.model("Book", bookSchema);