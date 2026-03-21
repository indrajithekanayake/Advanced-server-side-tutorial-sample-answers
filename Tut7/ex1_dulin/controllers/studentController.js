const pool = require('../db');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM students');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get a specific student
exports.getStudentById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const { rows } = await pool.query('SELECT * FROM students WHERE id = $1', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Add a new student
exports.addStudent = async (req, res) => {
    const { name, age } = req.body;
    if (!name || !age) {
        return res.status(400).json({ message: "Name and age are required" });
    }

    try {
        const { rows } = await pool.query(
            'INSERT INTO students (name, age) VALUES ($1, $2) RETURNING *',
            [name, age]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update a student (PUT requires full replacement)
exports.updateStudent = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age } = req.body;

    if (!name || age === undefined) {
        return res.status(400).json({ message: "Name and age are required for full update" });
    }

    try {
        const { rows } = await pool.query(
            'UPDATE students SET name = $1, age = $2 WHERE id = $3 RETURNING *',
            [name, age, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update part of a student (PATCH)
exports.patchStudent = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age } = req.body;

    try {
        const { rows: currentData } = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
        if (currentData.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const student = currentData[0];

        const newName = name !== undefined ? name : student.name;
        const newAge = age !== undefined ? age : student.age;

        const { rows } = await pool.query(
            'UPDATE students SET name = $1, age = $2 WHERE id = $3 RETURNING *',
            [newName, newAge, id]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const result = await pool.query('DELETE FROM students WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Student not found" });
        } else {
            return res.status(200).json({ message: "Student deleted successfully" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
