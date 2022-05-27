const express = require("express");
const validateId = require("../middleware/validateId");
const Todo = require("../models/todo");

const router = express.Router();

router.get("/", async (req, res) => {
  const todos = await Todo.find().sort("title");
  res.send(todos);
});

router.get("/:id", validateId, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).send();
  res.send(todo);
});

router.post("/", async (req, res) => {
  if (!req.body.title) return res.status(400).send("Title is required.");

  const todo = new Todo({ title: req.body.title });
  await todo.save();
  res.status(201).send(todo);
});

router.delete("/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (!todo)
    return res.status(404).send("The todo with the given ID was not found.");

  res.status(204).send();
});

module.exports = router;
