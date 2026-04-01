const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine for client-side rendering
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Student & Course Management API"
  });
});

// API routes
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});