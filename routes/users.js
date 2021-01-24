const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @route   POST api/users
// @desc    Register a user
// @access  Public

router.post(
  "/",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid e-mail").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email }); // Check the DB to see if user email already exist
      if (user) {
        return res.status(400).json({ msg: "User already exists" }); // User already exists
      }

      // If user doesnt exists, take user and set it to a new User:
      user = new User({
        name,
        email,
        password,
      });

      // Encrypting the user Password and saving it to the DB:
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save(); // Save to DB

      res.send("User saved");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
