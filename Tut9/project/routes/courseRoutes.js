const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const apiKeyAuth = require("../middleware/apiKeyAuth");

// Protected routes
router.post("/", apiKeyAuth, courseController.addCourse);
router.get("/", apiKeyAuth, courseController.getAllCourses);
router.get("/:id", apiKeyAuth, courseController.getCourseById);
router.put("/:id", apiKeyAuth, courseController.updateCourse);
router.patch("/:id", apiKeyAuth, courseController.patchCourse);
router.delete("/:id", apiKeyAuth, courseController.deleteCourse);

module.exports = router;