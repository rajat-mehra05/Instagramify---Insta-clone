const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const router = express.Router();
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");

//sign up route
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please fill all the fields 👀" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with this email 🤦" });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          pic,
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "Details saved. 💃 " });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//sign in route
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "Please provide the specified details. 🤦" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Email or password 😿" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          /* res.json({ message: "Successfully signed in" }); */
          const token = jwt.sign({ _id: savedUser.id }, process.env.JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res
            .status(422)
            .json({ error: "Invalid Email or password 😿" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
