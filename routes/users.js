const router = require("express").Router();
const bcrypt = require("bcryptjs");
const redirect = require("express/lib/response");
const User = require("../models/User.model");
const saltRounds = 10;
const userLogged = require("../middleware/userLogged");

// Signing up

router.get("/signup", (req, res, next) => {
  res.render("users/signup");
});

router.post("/signup", function (req, res, next) {
  if (!req.body.email) {
    res.send("You did not include an email");
  } else if (!req.body.password) {
    res.send("You need a password");
  } else if (!req.body.fullName) {
    res.send("You must enter your full name");
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  User.create({
    email: req.body.email,
    password: hashedPass,
    fullName: req.body.fullName,
  })
    .then((newUser) => {
      console.log("User was created", newUser);
      res.redirect("/");
    })
    .catch((err) => {
      res.send("This username is already taken");
      console.log("Something went wrong", err.errors);
    });
});

//Log In

router.get("/login", function (req, res, next) {
  res.render("users/login");
});

router.post("/login", function (req, res, next) {
  // Check if user left any field blank
  if (!req.body.email) {
    res.send("You did not include an email");
  } else if (!req.body.password) {
    res.send("You need a password");
  }
  // Check if the username is correct
  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (!foundUser) {
        return res.send("User not found");
      }
      // Check if the password is correct
      const match = bcrypt.compareSync(req.body.password, foundUser.password);
      // If the password doesn't match
      if (!match) {
        return res.send("Incorrect password");
      }
      // If all of the above checks pass, session can be called
      req.session.user = foundUser;
      res.render("users/welcome", { user: req.session.user });
    })
    .catch((err) => {
      console.log("Something went wrong", err);
    });
});

// Profile access if logged in
router.get("/profile", userLogged, function (req, res, next) {
  res.render("users/profile");
});

// Log Out
router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.render("users/logout");
});

module.exports = router;
