'use strict'

var students = exports.students = [
    {
        id: 1,
        name: 'Nimal Perera',
        email: 'nimal.perera@example.com',
        course: 'Software Engineering',
        year: 2
    },
    {
        id: 2,
        name: 'Kavindi Silva',
        email: 'kavindi.silva@example.com',
        course: 'Computer Science',
        year: 3
    },
    {
        id: 3,
        name: 'Dineth Fernando',
        email: 'dineth.fernando@example.com',
        course: 'Information Technology',
        year: 1
    }
];

var nextStudentId = 4;

exports.getAllStudents = function () {
    return students;
};

exports.getStudentById = function (studentId) {
    return students.find(function (student) {
        return student.id === studentId;
    });
};

exports.getStudentIndexById = function (studentId) {
    return students.findIndex(function (student) {
        return student.id === studentId;
    });
};

exports.getStudentByEmail = function (email) {
    return students.find(function (student) {
        return student.email.toLowerCase() === email.toLowerCase();
    });
};

exports.createStudent = function (studentData) {
    var student = {
        id: nextStudentId++,
        name: studentData.name,
        email: studentData.email,
        course: studentData.course,
        year: studentData.year
    };

    students.push(student);
    return student;
};

exports.replaceStudent = function (studentId, studentData) {
    var studentIndex = exports.getStudentIndexById(studentId);

    if (studentIndex === -1) {
        return null;
    }

    students[studentIndex] = {
        id: studentId,
        name: studentData.name,
        email: studentData.email,
        course: studentData.course,
        year: studentData.year
    };

    return students[studentIndex];
};

exports.updateStudentPartially = function (studentId, updates) {
    var student = exports.getStudentById(studentId);

    if (!student) {
        return null;
    }

    Object.keys(updates).forEach(function (field) {
        student[field] = updates[field];
    });

    return student;
};

exports.deleteStudent = function (studentId) {
    var studentIndex = exports.getStudentIndexById(studentId);

    if (studentIndex === -1) {
        return null;
    }

    return students.splice(studentIndex, 1)[0];
};