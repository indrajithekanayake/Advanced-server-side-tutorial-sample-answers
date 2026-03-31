'use strict'

var db = require('../../db');
var apiKeyAuth = require('../../middleware/apiKeyAuth');

exports.name = 'student';
exports.prefix = '/api';
exports.before = apiKeyAuth;

function isValidStudentId(value) {
  var studentId = Number(value);
  return Number.isInteger(studentId) && studentId > 0;
}

function sendStudentNotFound(res, studentId) {
  return res.status(404).json({
    message: 'Student with id ' + studentId + ' was not found',
    error: 'Not Found'
  });
}

exports.list = function (req, res) {
  var allStudents = db.getAllStudents();

  return res.status(200).json({
    message: 'Students retrieved successfully',
    count: allStudents.length,
    data: allStudents
  });
};

exports.show = function (req, res) {
  var studentId = Number(req.params.student_id);

  if (!isValidStudentId(studentId)) {
    return res.status(400).json({
      message: 'Student id must be a positive integer',
      error: 'Bad Request'
    });
  }

  var student = db.getStudentById(studentId);

  if (!student) {
    return sendStudentNotFound(res, studentId);
  }

  return res.status(200).json({
    message: 'Student retrieved successfully',
    data: student
  });
};

exports.create = function (req, res) {
  var payload = req.body;
  var existingStudent = db.getStudentByEmail(payload.email);

  if (existingStudent) {
    return res.status(409).json({
      message: 'A student with this email already exists',
      error: 'Conflict'
    });
  }

  var createdStudent = db.createStudent(payload);

  return res.status(201).json({
    message: 'Student created successfully',
    data: createdStudent
  });
};

exports.update = function (req, res) {
  var studentId = Number(req.params.student_id);

  if (!isValidStudentId(studentId)) {
    return res.status(400).json({
      message: 'Student id must be a positive integer',
      error: 'Bad Request'
    });
  }

  var existingStudent = db.getStudentById(studentId);

  if (!existingStudent) {
    return sendStudentNotFound(res, studentId);
  }

  var payload = req.body;
  var duplicateStudent = db.getStudentByEmail(payload.email);

  if (duplicateStudent && duplicateStudent.id !== studentId) {
    return res.status(409).json({
      message: 'Another student with this email already exists',
      error: 'Conflict'
    });
  }

  var updatedStudent = db.replaceStudent(studentId, payload);

  return res.status(200).json({
    message: 'Student updated successfully',
    data: updatedStudent
  });
};

exports.partialUpdate = function (req, res) {
  var studentId = Number(req.params.student_id);

  if (!isValidStudentId(studentId)) {
    return res.status(400).json({
      message: 'Student id must be a positive integer',
      error: 'Bad Request'
    });
  }

  var existingStudent = db.getStudentById(studentId);

  if (!existingStudent) {
    return sendStudentNotFound(res, studentId);
  }

  var payload = req.body;

  if (normalizedPayload.email) {
    var duplicateStudent = db.getStudentByEmail(payload.email);

    if (duplicateStudent && duplicateStudent.id !== studentId) {
      return res.status(409).json({
        message: 'Another student with this email already exists',
        error: 'Conflict'
      });
    }
  }

  var updatedStudent = db.updateStudentPartially(studentId, payload);

  return res.status(200).json({
    message: 'Student partially updated successfully',
    data: updatedStudent
  });
};

exports.delete = function (req, res) {
  var studentId = Number(req.params.student_id);

  if (!isValidStudentId(studentId)) {
    return res.status(400).json({
      message: 'Student id must be a positive integer',
      error: 'Bad Request'
    });
  }

  var deletedStudent = db.deleteStudent(studentId);

  if (!deletedStudent) {
    return sendStudentNotFound(res, studentId);
  }

  return res.status(200).json({
    message: 'Student deleted successfully',
    data: deletedStudent
  });
};