//File Name: index.js
//this file is for routing the login/register or home page
//Author Name: Shila (300969886) 
//Date: 25 Feb 2019
//web app: COMP308-W2019-MidTerm

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require("passport");
// define the user model
let userModel = require('../models/user');
let User = userModel.User; // alias
/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    displayName: req.user ? req.user.displayName : '',
    books: ''
   });
});

/* GET - displays the Login Page */
router.get('/login', (req, res, next) => {
  // check if user is already logged in
  if (!req.user) {
    res.render('auth/login', {
      title: "Login",
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
  } else {
    return res.redirect("/");
  }
});

/* POST - processes the Login Page */
router.post('/login', (req, res, next) => {
  passport.authenticate('local',
    (err, user, info) => {
      // server error?
      if (err) {
        return next(err);
      }
      // is there a user login error?
      if (!user) {
        req.flash("loginMessage", "Authentication Error");
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        // server error?
        if (err) {
          return next(err);
        }
        return res.redirect('/books');
      });
    })(req, res, next);
});

/* GET - displays the User Registration Page */
router.get('/register', (req, res, next) => {
  if (!req.user) {
    res.render("auth/register", {
      title: "Register",
      messages: req.flash("registerMessage"),
      displayName: req.user ? req.user.displayName : ""
    });
  } else {
    return res.redirect("/");
  }
});

/* POST - processes the User Registration Page */
router.post('/register', (req, res, next) => {
  //console.log(req.body);
  // define a new user object
  let newUser = new User({
    username: req.body.username,    
    email: req.body.email,
    displayName: req.body.displayName
  });

  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log("Error: Inserting New User");
      if (err.name == "UserExistsError") {
        req.flash(
          "registerMessage",
          "Registration Error: User Already Exists!"
        );
        console.log("Error: User Already Exists!");
      }
      return res.render("auth/register", {
        title: "Register",
        messages: req.flash("registerMessage"),
        displayName: req.user ? req.user.displayName : ""
      });
    } else {
      // if no error exists, then registration is successful
      console.log("registration successful");
      // redirect the user
      return passport.authenticate("local")(req, res, () => {
        res.redirect("/books");
      });
    }
  });
});

/* GET - perform user logout */
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect("/");
});


module.exports = router;
