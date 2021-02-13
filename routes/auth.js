const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private

router.get("/", auth, async (req, res) => {
  // res.send("Get logged in user");

  try {
    const user = await User.findById(req.user.id).select("-password"); // Mongoose findById() method to get the user with the given id,auth with password ommited
    res.json(user);
  } catch (err) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Auth user and get tokken
// @access  Public

router.post(
  "/",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign the payload with JWT Token. jwt.sign() method takes payload and secret as arguments and should return res.json({token}) as callback
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
