const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    // Generate an access token
    const accessToken = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });
    return res.status(200).json({ message: "User successfully logged in", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Middleware to authenticate JWT and set req.user
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      console.log("Token received:", token); // Debug log
  
      jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
        if (err) {
          console.log("Token verification error:", err); // Debug log
          return res.sendStatus(403);
        }
  
        req.user = user;
        next();
      });
    } else {
      console.log("No auth header present"); // Debug log
      res.status(401).json({ message: "User not logged in" });
    }
  };

// Add a book review
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Assuming the user is authenticated and username is available in req.user
  const username = req.user.username;

  // Add or update the review for the book
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const isbn = req.params.isbn;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const username = req.user.username;
  
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
