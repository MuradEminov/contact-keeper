const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const Apple = require("../models/Apple");

router.post(
  "/",
  [body("name", "Name must be minimum 8 characters").isLength({ min: 8 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;
      let apple = new Apple({
        name,
      });

      await apple.save();
      console.log("Apple saved.");
      res.send("Apple saved");
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
