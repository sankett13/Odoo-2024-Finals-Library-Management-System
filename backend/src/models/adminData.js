const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  superUser: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
