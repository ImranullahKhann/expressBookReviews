const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records
  checkCredentials = users.filter(user => {
    return user.username === username && user.password === password
  })
  if (checkCredentials.length > 0)
    return true

  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in." });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization["username"]
  if (!req.query)
    return res.status(400).json({ message: "You need to specify a review as a query parameter!" });

  const review = req.query.review.replace("-", " ")
  books[req.params.isbn].reviews[username] = review
  return res.status(201).json({ message: "Review added successfully!"})
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization["username"]
  
  if (!books[req.params.isbn].reviews[username])
    return res.status(404).json({ message: "No review added from the current user."})
  
  delete books[req.params.isbn].reviews[username]
  return res.status(200).json({ message: "Review removed successfully!"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
