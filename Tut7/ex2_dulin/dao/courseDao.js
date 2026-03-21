const pool = require('../db');

class CourseDao {
    async getAllCourses() {
        const { rows } = await pool.query('SELECT * FROM courses');
        return rows;
    }

    async getCourseById(id) {
        const { rows } = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
        return rows[0] || null;
    }

    async createCourse(courseData) {
        const { course_name, instructor_name, credit_value, department } = courseData;
        const { rows } = await pool.query(
            'INSERT INTO courses (course_name, instructor_name, credit_value, department) VALUES ($1, $2, $3, $4) RETURNING *',
            [course_name, instructor_name, credit_value, department]
        );
        return rows[0];
    }

    async updateCourse(id, courseData) {
        // Full Replacement
        const { course_name, instructor_name, credit_value, department } = courseData;
        const { rows } = await pool.query(
            'UPDATE courses SET course_name = $1, instructor_name = $2, credit_value = $3, department = $4 WHERE id = $5 RETURNING *',
            [course_name, instructor_name, credit_value, department, id]
        );
        return rows[0] || null;
    }
    
    async patchCourse(id, courseData) {
        // Build dynamic query for partial updates
        const fields = [];
        const values = [];
        
        let queryIdx = 1;

        if (courseData.course_name !== undefined) {
            fields.push(`course_name = $${queryIdx++}`);
            values.push(courseData.course_name);
        }
        if (courseData.instructor_name !== undefined) {
            fields.push(`instructor_name = $${queryIdx++}`);
            values.push(courseData.instructor_name);
        }
        if (courseData.credit_value !== undefined) {
            fields.push(`credit_value = $${queryIdx++}`);
            values.push(courseData.credit_value);
        }
        if (courseData.department !== undefined) {
            fields.push(`department = $${queryIdx++}`);
            values.push(courseData.department);
        }

        if (fields.length === 0) {
            throw new Error("No data provided for update");
        }

        values.push(id);
        const query = `UPDATE courses SET ${fields.join(", ")} WHERE id = $${queryIdx} RETURNING *`;

        const { rows } = await pool.query(query, values);
        return rows[0] || null;
    }

    async deleteCourse(id) {
        const result = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}

module.exports = new CourseDao();
