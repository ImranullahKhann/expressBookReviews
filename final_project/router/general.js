const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }

    return res.status(400).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
    setTimeout(res.send(JSON.stringify(books,null,4)), 500);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    setTimeout(res.send(JSON.stringify(books[isbn], null, 4)), 500)
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase().replace("-", " "))
  setTimeout(res.send(JSON.stringify(booksByAuthor[0], null, 4)), 500)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  const bookByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase().replace("-", " "))
  setTimeout(res.send(JSON.stringify(bookByTitle[0], null, 4)), 500)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4))
});

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}



module.exports.general = public_users;
