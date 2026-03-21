const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/', courseController.addCourse);
router.put('/:id', courseController.updateCourse);
router.patch('/:id', courseController.patchCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
