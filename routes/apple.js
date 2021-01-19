const express = require("express");
const router = express.Router();

const Apple = require("../models/Apple");

router.post("/", async (req, res) => {
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
});

module.exports = router;
