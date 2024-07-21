// db.js

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://gamiyash0207:gamiyash0207@oddolibmanagement.f6cvila.mongodb.net/?retryWrites=true&w=majority&appName=oddoLibManagement';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
};

module.exports = connectDB;
