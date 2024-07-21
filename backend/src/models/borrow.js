const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ISBN: {
    type: String,
    required: true
  },
  borrowdate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 60 * 1000);
    }
  },
  dueDate: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const Borrow = mongoose.model('Borrow', borrowSchema);

module.exports = Borrow;
