const express = require('express');
const app = express();
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')



const PORT = 8080;
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
  }));



// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/',require(path.join(__dirname, '/src/routes/routes.js')))
app.use(cookieParser())

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

module.exports = app;
