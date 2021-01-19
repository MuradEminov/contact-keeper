const mongoose = require("mongoose");

const AppleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("apple", AppleSchema);
