const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
);

// Routes
app.use('/auth', authRoutes);

// Root redirect
app.get('/', (req, res) => res.redirect('/auth/login'));

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));