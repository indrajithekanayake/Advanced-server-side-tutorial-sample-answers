const courseDao = require('../dao/courseDao');

class CourseModel {
    constructor() {
        this.courseDao = courseDao;
    }

    async getAllCourses() {
        return await this.courseDao.getAllCourses();
    }

    async getCourseById(id) {
        const course = await this.courseDao.getCourseById(id);
        if (course) return course;
        throw new Error('Course not found');
    }

    async createCourse(data) {
        return await this.courseDao.createCourse(data);
    }

    async updateCourse(id, data) {
        const updatedCourse = await this.courseDao.updateCourse(id, data);
        if (updatedCourse) return updatedCourse;
        throw new Error('Course not found');
    }
    
    async patchCourse(id, data) {
        const updatedCourse = await this.courseDao.patchCourse(id, data);
        if (updatedCourse) return updatedCourse;
        throw new Error('Course not found');
    }

    async deleteCourse(id) {
        const deleted = await this.courseDao.deleteCourse(id);
        if (!deleted) throw new Error('Course not found');
        return true;
    }
}

module.exports = new CourseModel();
