const express = require("express");
const cors = require("cors");
const homeRoutes = require("./routes/index");
const todoRoutes = require("./routes/todos");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/", homeRoutes);
app.use("/api/todos", todoRoutes);

module.exports = app;
