//File Name: book.js
//this file is for routing the book CRUD
//Author Name: Shila (300969886) 
//Date: 23 Feb 2019
//web app: COMP308-W2019-MidTerm

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

function requireAuth(req, res, next) {
  // check if the user is logged in
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}



/* GET books List page. READ */
router.get('/', requireAuth, (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books,
        displayName: req.user ? req.user.displayName : ''
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', requireAuth, (req, res, next) => {
  res.render('books/details', {
    title: 'Add New book',
    displayName: req.user ? req.user.displayName : '',
    books: ''
  });

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', requireAuth, (req, res, next) => {
   // console.log(req.body);
    let newBook=book({
      "Title": req.body.title,
      //"Description":req.body.description,
      "Price":req.body.price,
      "Author":req.body.author,
      "Genre":req.body.genre
    });
    book.create(newBook,(err,book)=>{
      if(err){
        console.log(err);
        res.end(err);
      }
      else
        {
          //refresh the book list
          res.redirect('/books');
        }
    });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', requireAuth, (req, res, next) => {

    let id=req.params.id;
    book.findById(id,(err,bookObject)=>{
      if(err){
        console.log(err);
        res.end(err);
      }
      else{
          //show the detail view for edit or delete
          res.render('books/details',{
            title: 'Detail book',
            displayName: req.user ? req.user.displayName : '',
            books:bookObject
      });
      }
    });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {

  let id = req.params.id;
  let updatedBook = book({
    "_id": id,
    "Title": req.body.title,
    //"Description":req.body.description,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
  });
  book.update({ _id:id }, updatedBook, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      //refresh the book list
      res.redirect('/books');
    }
  });
});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {

//    console.log('test delete');
  //  console.log(req.params);
  let id = req.params.id;
  book.remove({ _id: id }, (err) => {
    if (err) {
      console.log(err);
      res.end(err);
    }
    else {
      //refresh the book list
      res.redirect('/books');
    }
  });
});


module.exports = router;
