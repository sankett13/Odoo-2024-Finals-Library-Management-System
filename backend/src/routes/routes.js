const app = require("../../app");
const express = require("express");
const connectDB = require("../models/database");
const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminData");
const Book = require("../models/books");
const nodemailer = require("nodemailer");
const Borrow = require("../models/borrow");
const schedule = require("node-schedule");

const router = express.Router();

// 9781590171998

// Database conncection
connectDB();
const secretKey = "sahcnlruiatypimhgfacp475391465cnagsklnx23y5x849y5nkwacbbd";
router.use(cookieParser());

async function checkOverdueBooksAndNotify() {
  const overdueBooks = await Borrow.find({
    returnDate: { $lt: new Date() },
  }).populate("userId");

  if (overdueBooks.length > 0) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "mailermern@gmail.com",
        pass: "yfsg kkoy wpsf pzdy",
      },
    });

    let mailOptions = {
      from: "mailermern@example.com",
      to: overdueBooks.map((book) => book.userId.email),
      subject: "Reminder: Return Your Borrowed Book",
      text: "Please return the book(s) you borrowed as soon as possible.",
    };

    let info = await transporter.sendMail(mailOptions);

    console.log("Email sent: ", info.messageId);
  }
}

function scheduleEmailNotifications() {
  setInterval(async () => {
    console.log("Checking for overdue books...");
    await checkOverdueBooksAndNotify();
  }, 10 * 1000);
}

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      console.log("User created successfully");
      res.status(201).json({ message: "User created successfully" });
    } else {
      console.log("User not created");
      res.status(400).json({ message: "User not created" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username.includes("@admin.com")) {
      const user = await Admin.findOne({ username });
      if (password === user.password) {
        const token = jwt.sign(
          {
            userId: user._id,
            userName: user.username,
            isadmin: user.isAdmin,
            superUser: user.superUser,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { httpOnly: true, secure: true });

        res.json({
          isAuthenticated: true,
          user: {
            id: user._id,
            name: user.username,
            isadmin: user.isAdmin,
            superUser: user.superUser,
          },
        });
      }
    } else {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const validatePassword = await bcrypt.compare(password, user.password);
      if (!validatePassword) {
        return res.status(401).json({ message: "Invalid password" });
      } else {
        const token = jwt.sign(
          {
            userId: user._id,
            userName: user.username,
            isadmin: user.isAdmin,
            superUser: user.superUser,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { httpOnly: true, secure: true });
        res.json({
          isAuthenticated: true,
          user: {
            id: user._id,
            name: user.username,
            isadmin: user.isAdmin,
            superUser: user.superUser,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/check-auth", (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.json({ isAuthenticated: false });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const { userId, userName, isadmin, superUser } = decoded;
    res.json({
      isAuthenticated: true,
      user: {
        id: userId,
        name: userName,
        isadmin: isadmin,
        superUser: superUser,
      },
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.json({ isAuthenticated: false });
  }
});

router.post("/borrow/:bookId", async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify token
    const decode = jwt.verify(token, secretKey);
    const { userId } = decode;
    const { bookId } = req.params;

    // Fetch book details
    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Fetch user details including email
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + 60000); // 1 minute after borrowing

    // Create a new borrow record
    const borrow = new Borrow({
      userId: new mongoose.Types.ObjectId(userId),
      ISBN: book.ISBN,
      borrowDate: borrowDate,
      returnDate: dueDate,
      dueDate: dueDate,
      email: user.email,
    });

    await borrow.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "mailermern@gmail.com",
        pass: "yfsg kkoy wpsf pzdy",
      },
    });

    // Send immediate confirmation email
    const confirmationMailOptions = {
      from: "mailermern@gmail.com",
      to: user.email,
      subject: "Book Borrowed Confirmation",
      text: `Dear ${user.name},\n\nYou have successfully borrowed the book "${
        book.title
      }". It is due on ${dueDate.toLocaleString()}.\n\nThank you,\nLibrary Team`,
    };

    try {
      await transporter.sendMail(confirmationMailOptions);
      console.log("Confirmation email sent");
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }

    // Schedule reminder email to be sent after 1 minute
    setTimeout(async () => {
      const reminderMailOptions = {
        from: "mailermern@gmail.com",
        to: user.email,
        subject: "Book Due Reminder",
        text: `Dear ${user.name},\n\nThis is a reminder that the book "${book.title}" is due now. Please return it as soon as possible.\n\nThank you,\nLibrary Team`,
      };

      try {
        await transporter.sendMail(reminderMailOptions);
        console.log("Due date reminder email sent");
      } catch (error) {
        console.error("Error sending due date reminder email:", error);
      }
    }, 60000); // 60000 milliseconds = 1 minute

    res.status(201).json({ message: "Book borrowed successfully", borrow });
  } catch (error) {
    console.error("Failed to borrow book:", error.message);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

router.post("/createBook", async (req, res) => {
  const { isbn } = req.body;

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch book data");
    }

    const data = await response.json();

    if (data.totalItems === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    const bookData = data.items[0].volumeInfo;

    let description = bookData.description || "No description available";
    let firstStopIndex = description.indexOf(".");
    if (firstStopIndex !== -1) {
      firstStopIndex = description.indexOf(".", firstStopIndex + 1);
    }
    if (firstStopIndex !== -1) {
      description = description.substring(0, firstStopIndex + 1);
    }

    const newBook = new Book({
      ISBN: isbn,
      title: bookData.title,
      author: bookData.authors ? bookData.authors.join(", ") : "Unknown",
      publisher: bookData.publisher || "Unknown",
      year: bookData.publishedDate
        ? new Date(bookData.publishedDate).getFullYear()
        : null,
      genre: bookData.categories ? bookData.categories.join(", ") : "Unknown",
      quantity: 1,
      description: description,
    });

    const savedBook = await newBook.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "mailermern@gmail.com",
        pass: "yfsg kkoy wpsf pzdy",
      },
    });

    const users = await User.find();
    const mailOptions = {
      from: "mailermern@gmail.com",
      to: users.map((user) => user.email).join(", "),
      subject: "New Book Added!",
      text: `A new book titled "${bookData.title}" has been added to our collection. Check it out!`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Error sending email to users" });
      } else {
        console.log("Email sent: " + info.response);
        res
          .status(200)
          .json({ message: "Book added successfully", bookData: savedBook });
      }
    });
  } catch (error) {
    console.error("Error fetching or saving book data:", error);
    res.status(500).json({ message: "Error fetching or saving book data" });
  }
});

router.get("/showBooks", async (req, res) => {
  try {
    const books = await Book.find();
    const booksWithImages = await Promise.all(
      books.map(async (book) => {
        try {
          const isbn = book.ISBN;
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch book data for ISBN: ${isbn}`);
          }

          const data = await response.json();
          if (data.totalItems === 0) {
            throw new Error(`Book not found for ISBN: ${isbn}`);
          }

          const thumbnailUrl =
            data.items[0].volumeInfo.imageLinks?.smallThumbnail;
          return { ...book.toObject(), thumbnailUrl };
        } catch (error) {
          console.error(
            `Error fetching book data for ISBN ${book.ISBN}:`,
            error
          );
          // Return a placeholder or handle the error gracefully
          return { ...book.toObject(), thumbnailUrl: null };
        }
      })
    );

    res.json(booksWithImages);
  } catch (error) {
    console.error("Error fetching books with images:", error);
    res.status(500).json({ error: "Failed to fetch books with images" });
  }
});

router.get("/displayBook/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const isbn = book.ISBN;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch book data from Google Books API");
    }

    const data = await response.json();
    if (data.totalItems === 0) {
      throw new Error("Book not found in Google Books API");
    }

    const bookData = data.items[0].volumeInfo;
    const description = bookData.description || "Description not available";
    const thumbnailUrl =
      bookData.imageLinks?.thumbnail || "No thumbnail available";

    await Book.findByIdAndUpdate(id, { description, thumbnailUrl });
    res.json({ ...book.toObject(), description, thumbnailUrl });
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ error: "Failed to fetch book details" });
  }
});

router.post("/queryBook", async (req, res) => {
  const { query } = req.body;
  try {
    const booksFromDB = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
        { publisher: { $regex: query, $options: "i" } },
      ],
    });
    const booksWithThumbnails = await Promise.all(
      booksFromDB.map(async (book) => {
        try {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch thumbnail from Google Books API");
          }
          const data = await response.json();
          const thumbnailUrl =
            data.items?.[0]?.volumeInfo?.imageLinks?.smallThumbnail;
          return {
            ...book.toObject(),
            smallThumbnail: thumbnailUrl,
          };
        } catch (error) {
          console.error(
            `Failed to fetch thumbnail for book ${book.title}:`,
            error.message
          );
          return {
            ...book.toObject(),
            smallThumbnail: null,
          };
        }
      })
    );

    res.json(booksWithThumbnails);
  } catch (error) {
    console.error("Failed to fetch search results:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/deleteBook/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const result = await Book.findByIdAndDelete(bookId);

    if (!result) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/userInfo", async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const { userName } = decoded;

    // Fetch user details from MongoDB based on username
    const user = await User.findOne({ username: userName });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user details in the response
    res.json({
      isAuthenticated: true,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error("Error decoding token or fetching user:", err);
    res.status(500).json({ error: "Failed to authenticate or fetch user" });
  }
});

router.get("/admin/stats", async (req, res) => {
  try {
    // Count all current borrows
    const booksBorrowed = await Borrow.countDocuments({
      returnDate: { $gt: new Date() },
    });

    // Calculate total quantity of all books
    const booksAggregate = await Book.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);
    const availableBooks = booksAggregate[0]?.totalQuantity || 0;

    // Count pending dues (books not returned after due date)
    const pendingDues = await Borrow.countDocuments({
      dueDate: { $lt: new Date() },
      returnDate: { $gt: new Date() },
    });

    // New stats:

    // Total number of users
    const totalUsers = await User.countDocuments();

    // Total number of books (unique titles)
    const totalBooks = await Book.countDocuments();

    // Most borrowed book
    const mostBorrowedBook = await Borrow.aggregate([
      { $group: { _id: "$ISBN", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "ISBN",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      { $project: { title: "$bookDetails.title", count: 1 } },
    ]);

    // Books borrowed in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentBorrows = await Borrow.countDocuments({
      borrowdate: { $gte: sevenDaysAgo },
    });

    res.json({
      booksBorrowed,
      availableBooks,
      pendingDues,
      totalUsers,
      totalBooks,
      mostBorrowedBook: mostBorrowedBook[0] || { title: "N/A", count: 0 },
      recentBorrows,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Error fetching admin stats" });
  }
});

module.exports = router;
