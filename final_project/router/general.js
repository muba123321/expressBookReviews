const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const baseUrl = 'http://localhost:5000';
public_users.post("/register", (req,res) => {
  //Write your code here
 // Retrieve the username and password from the request body
 const { username, password } = req.body;

 // Check if both username and password are provided
 if (!username || !password) {
   return res.status(400).json({ message: "Username and password are required" });
 }

 // Check if the username already exists
 const userExists = users.some(user => user.username === username);
 if (userExists) {
   return res.status(409).json({ message: "Username already exists" });
 }

 // Register the new user
 users.push({ username, password });
 return res.status(201).json({ message: "User successfully registered. Now you can login." });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(200).json(JSON.stringify(books, null, 2));
// });

// Get the book list available in the shop using Promises
public_users.get('/', (req, res) => {
  axios.get(`${baseUrl}/books`)
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error fetching books', error });
    });
});

// Alternatively, using async-await
public_users.get('/async', async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/books`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});
// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
// const isbn = req.params.isbn;

// // Check if the book with the given ISBN exists
// const book = books[isbn];

// if (book) {
//   // Return the book details
//   return res.status(200).json(book);
// } else {
//   // Return an error message if the book is not found
//   return res.status(404).json({ message: "Book not found" });
// }
//  });
// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    axios.get(`${baseUrl}/books/${isbn}`)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book details', error });
      });
  });
  
  // Alternatively, using async-await
  public_users.get('/isbn/:isbn/async', async (req, res) => {
    const { isbn } = req.params;
    try {
      const response = await axios.get(`${baseUrl}/books/${isbn}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details', error });
    }
  });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//    // Retrieve the author from the request parameters
//    const author = req.params.author;

//    // Initialize an array to hold books by the specified author
//    let booksByAuthor = [];
 
//    // Iterate through the books object
//    Object.keys(books).forEach((key) => {
//      if (books[key].author === author) {
//        booksByAuthor.push(books[key]);
//      }
//    });
 
//    if (booksByAuthor.length > 0) {
//      // Return the books by the specified author
//      return res.status(200).json(booksByAuthor);
//    } else {
//      // Return an error message if no books are found by the specified author
//      return res.status(404).json({ message: "No books found by this author" });
//    }
// });

// Get book details based on author using Promises
public_users.get('/author/:author', (req, res) => {
    const { author } = req.params;
    axios.get(`${baseUrl}/books?author=${author}`)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book details', error });
      });
  });
  
  // Alternatively, using async-await
  public_users.get('/author/:author/async', async (req, res) => {
    const { author } = req.params;
    try {
      const response = await axios.get(`${baseUrl}/books?author=${author}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details', error });
    }
  });

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   // Retrieve the title from the request parameters
//   const title = req.params.title;

//   // Initialize an array to hold books by the specified title
//   let booksByTitlte = [];

//   // Iterate through the books object
//   Object.keys(books).forEach((key) => {
//     if (books[key].title === title) {
//       booksByTitlte.push(books[key]);
//     }
//   });

//   if (booksByTitlte.length > 0) {
//     // Return the books by the specified title
//     return res.status(200).json(booksByTitlte);
//   } else {
//     // Return an error message if no books are found by the specified title
//     return res.status(404).json({ message: "No books found by this title" });
//   }
// });

public_users.get('/title/:title', (req, res) => {
    const { title } = req.params;
    axios.get(`${baseUrl}/books?title=${title}`)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book details', error });
      });
  });
  
  // Alternatively, using async-await
  public_users.get('/title/:title/async', async (req, res) => {
    const { title } = req.params;
    try {
      const response = await axios.get(`${baseUrl}/books?title=${title}`);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching book details', error });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  const book = books[isbn];

  if (book && book.reviews) {
    // Return the book reviews
    return res.status(200).json(book.reviews);
  } else {
    // Return an error message if the book or reviews are not found
    return res.status(404).json({ message: "Book or reviews not found" });
  }
});

module.exports.general = public_users;
