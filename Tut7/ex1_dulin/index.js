const express = require('express');
const app = express();
const studentRoutes = require('./routes/studentRoutes');

// Middleware to parse JSON bodies
app.use(express.json());

// Routes

app.get('/', (req, res) => {
    res.send("Home Page");
})
app.use('/students', studentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
