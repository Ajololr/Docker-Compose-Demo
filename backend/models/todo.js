const mongoose = require("mongoose");

const Todo = mongoose.model(
  "Todo",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
  })
);

module.exports = Todo;
