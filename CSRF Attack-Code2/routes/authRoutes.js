const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Show register page
router.get('/register', (req, res) => res.render('register'));

// Show login page
router.get('/login', (req, res) => res.render('login'));

// Dashboard (protected)
router.get('/dashboard', (req, res) => {
    if (!req.session.userId) return res.redirect('/auth/login');
    res.render('dashboard', { user: { email: req.session.email } });
});

// Register POST
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        await authController.register({ name, email, password });
        res.redirect('/auth/login');
    } catch (err) {
        res.send(`Error: ${err.message}`);
    }
});

// Login POST
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await authController.login(email, password);
        if (!user) return res.send('Invalid credentials');

        req.session.userId = user.id;
        req.session.email = user.email;
        res.redirect('/auth/dashboard');
    } catch (err) {
        res.send(`Error: ${err.message}`);
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/auth/login'));
});

// Simulate sensitive action (like changing email)
router.post('/change-email', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Not logged in');
    }

    const newEmail = req.body.email;

    // Simulate update (no DB update needed for demo)
    req.session.email = newEmail;

    res.send(`Email changed to ${newEmail}`);
});

module.exports = router;