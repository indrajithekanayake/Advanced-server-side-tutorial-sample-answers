let students = require("../models/studentModel");

// Add new student
exports.addStudent = (req, res) => {
  const { name, age, email, department } = req.body;

  if (!name || !age || !email || !department) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  const newStudent = {
    id: students.length ? students[students.length - 1].id + 1 : 1,
    name,
    age,
    email,
    department
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: "Student added successfully",
    data: newStudent
  });
};

// View all students
exports.getAllStudents = (req, res) => {
  res.status(200).json({
    success: true,
    data: students
  });
};

// View specific student
exports.getStudentById = (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
};

// Update full student info
exports.updateStudent = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, age, email, department } = req.body;

  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  if (!name || !age || !email || !department) {
    return res.status(400).json({
      success: false,
      message: "All fields are required for full update"
    });
  }

  students[studentIndex] = {
    id,
    name,
    age,
    email,
    department
  };

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: students[studentIndex]
  });
};

// Update part of student info
exports.patchStudent = (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  const { name, age, email, department } = req.body;

  if (name !== undefined) student.name = name;
  if (age !== undefined) student.age = age;
  if (email !== undefined) student.email = email;
  if (department !== undefined) student.department = department;

  res.status(200).json({
    success: true,
    message: "Student partially updated successfully",
    data: student
  });
};

// Delete student
exports.deleteStudent = (req, res) => {
  const id = parseInt(req.params.id);
  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Student not found"
    });
  }

  const deletedStudent = students.splice(studentIndex, 1);

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
    data: deletedStudent[0]
  });
};