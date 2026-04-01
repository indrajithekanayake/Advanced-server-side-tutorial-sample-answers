let courses = require("../models/courseModel");

// Add new course
exports.addCourse = (req, res) => {
  const { courseId, courseName, instructorName, creditValue, department } = req.body;

  if (!courseId || !courseName || !instructorName || !creditValue || !department) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const newCourse = {
    id: courses.length ? courses[courses.length - 1].id + 1 : 1,
    courseId,
    courseName,
    instructorName,
    creditValue,
    department
  };

  courses.push(newCourse);

  res.status(201).json({
    success: true,
    message: "Course added successfully",
    data: newCourse
  });
};

// View all courses
exports.getAllCourses = (req, res) => {
  res.status(200).json({
    success: true,
    data: courses
  });
};

// View specific course
exports.getCourseById = (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found"
    });
  }

  res.status(200).json({
    success: true,
    data: course
  });
};

// Update full course info
exports.updateCourse = (req, res) => {
  const id = parseInt(req.params.id);
  const { courseId, courseName, instructorName, creditValue, department } = req.body;

  const courseIndex = courses.findIndex((c) => c.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Course not found"
    });
  }

  if (!courseId || !courseName || !instructorName || !creditValue || !department) {
    return res.status(400).json({
      success: false,
      message: "All fields are required for full update"
    });
  }

  courses[courseIndex] = {
    id,
    courseId,
    courseName,
    instructorName,
    creditValue,
    department
  };

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: courses[courseIndex]
  });
};

// Update part of course info
exports.patchCourse = (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found"
    });
  }

  const { courseId, courseName, instructorName, creditValue, department } = req.body;

  if (courseId !== undefined) course.courseId = courseId;
  if (courseName !== undefined) course.courseName = courseName;
  if (instructorName !== undefined) course.instructorName = instructorName;
  if (creditValue !== undefined) course.creditValue = creditValue;
  if (department !== undefined) course.department = department;

  res.status(200).json({
    success: true,
    message: "Course partially updated successfully",
    data: course
  });
};

// Delete course
exports.deleteCourse = (req, res) => {
  const id = parseInt(req.params.id);
  const courseIndex = courses.findIndex((c) => c.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Course not found"
    });
  }

  const deletedCourse = courses.splice(courseIndex, 1);

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
    data: deletedCourse[0]
  });
};