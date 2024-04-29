const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean

  if (Object.values(users).some(user => user.username === username && user.password === password)) {
    return true;
  } else {
    return false;
  }

}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username == null || password == null) {
    res.status(401).send("Please enter your email & password !");

  } else if (authenticatedUser(username, password)) {
    req.session.username = username;

    let accessToken = jwt.sign({
      data: username
    }, 'access', {
      expiresIn: 60 * 60
    });
    req.session.authorization = {
      accessToken
    }
    return res.status(200).json({
      message: "Logged in successfully!"
    });
  } else {
    res.status(404).send("NOT FOUND !");
  }



});

regd_users.put("/auth/review/:isbn", (req, res) => { //the url should look something like this http://localhost:5000/customer/auth/review/1?review=First Reviewl

  //Write your code here

  const isbn = req.params.isbn;

  const review = req.query.review;

  const username = req.session.username; //this is the place where we stored our username

  if (!isbn) {

    return res.status(400).json({
      message: "ISBN is required"
    });

  }

  if (!review) {

    return res.status(400).json({
      message: "Review is required"
    });

  }

  if (!username) {

    return res.status(401).json({
      message: "User is not logged in"
    });

  }

  const book = books[isbn];

  if (!book) {

    return res.status(404).json({
      message: "Book not found"
    });

  }

  // Create a new review object for the user
  const userReview = {
    username,
    review
  };

  // Check if the book already has reviews
  if (!book.reviews) {
    // If not, initialize the reviews object with the user's review
    book.reviews = {
      [username]: userReview
    };
  } else {
    // If reviews object already exists, add the user's review to it
    book.reviews[username] = userReview;
  }
  return res.status(201).json({
    message: "Review added successfully"
  });


});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;


  const username = req.session.username;

  const book = books[isbn];

  if (!username) {
    return res.status(404).json({
      message: "Your Username Was Not Found"
    });
  } else {

    if (book.reviews[username]) {
      delete book.reviews[username];
    } else {
      return res.status(404).json({
        message: "You Have No Reviews To Delete"
      });

    }



    return res.status(200).json({
      message: "Review deleted successfully"
    });

  }

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
