const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  

 if (username == null || password == null){
    res.status(401).send("Please enter your email & password !");

  }
  else if(Object.values(users).some(user => user.username === username)){
    res.status(403).send("Username already exists.");
  }
 
  else{

  const newUser = {
    id: users.length + 1, // Generate a unique ID for the new user
    username: username,
    password: password, 
  };

  users.push(newUser);

 
  return res.status(201).json("Account created successfully!");

  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here  
  return res.send(JSON.stringify({books}));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const match= books[isbn];

  if(match){
    return res.send(JSON.stringify({book: match}));
  }
  
  else {
  return res.status(404).send("isbn not found !");
  } 


});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author= req.params.author;
  let filter=Object.values(books).filter((book)=>book.author===author);
 if (filter.length > 0){
  return res.status(300).json(filter);
 }
 else{
  return res.status(404).send('No books found for author: ' + author);

 }


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title= req.params.title;
  let filter=Object.values(books).filter((book)=>book.title===title);
 if (filter.length > 0){
  return res.status(300).json(filter);
 }
 else{
  return res.status(404).send('No books found for title: ' + title);

 }


});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {  
  const isbn = req.params.isbn;  //the isbn is before the ?
  const match= books[isbn];
  if (books[isbn]) {
    return res.status(300).json(match.reviews); 
  }

  else {
    return res.status(404).send('ISBN not found !');
  }

});

module.exports.general = public_users;
