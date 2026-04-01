const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const apiKeyAuth = require("../middleware/apiKeyAuth");

// Protected routes
router.post("/", apiKeyAuth, studentController.addStudent);
router.get("/", apiKeyAuth, studentController.getAllStudents);
router.get("/:id", apiKeyAuth, studentController.getStudentById);
router.put("/:id", apiKeyAuth, studentController.updateStudent);
router.patch("/:id", apiKeyAuth, studentController.patchStudent);
router.delete("/:id", apiKeyAuth, studentController.deleteStudent);

module.exports = router;