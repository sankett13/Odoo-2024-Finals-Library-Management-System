const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  ISBN: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String },
  year: { type: Number },
  genre: { type: String },
  quantity: { type: Number, default: 1 },
  description: { type: String }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
