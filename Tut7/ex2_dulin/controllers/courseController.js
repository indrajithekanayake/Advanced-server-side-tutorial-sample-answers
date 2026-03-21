const courseModel = require('../models/courseModel');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await courseModel.getAllCourses();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await courseModel.getCourseById(parseInt(req.params.id));
        res.json(course);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.addCourse = async (req, res) => {
    const { course_name, instructor_name, credit_value, department } = req.body;
    
    if (!course_name || !instructor_name || credit_value === undefined || !department) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    try {
        const newCourse = await courseModel.createCourse({ course_name, instructor_name, credit_value, department });
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCourse = async (req, res) => {
    const { course_name, instructor_name, credit_value, department } = req.body;
    
    if (!course_name || !instructor_name || credit_value === undefined || !department) {
        return res.status(400).json({ message: "Missing required fields for full update" });
    }
    
    try {
        const updatedCourse = await courseModel.updateCourse(parseInt(req.params.id), { course_name, instructor_name, credit_value, department });
        res.json(updatedCourse);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.patchCourse = async (req, res) => {
    try {
        const updatedCourse = await courseModel.patchCourse(parseInt(req.params.id), req.body);
        res.json(updatedCourse);
    } catch (err) {
        if (err.message === "No data provided for update") {
            res.status(400).json({ message: err.message });
        } else {
            res.status(404).json({ message: err.message });
        }
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        await courseModel.deleteCourse(parseInt(req.params.id));
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
