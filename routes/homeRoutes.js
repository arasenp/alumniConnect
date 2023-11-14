// routes/homeRoutes.js
const express = require('express');
const router = express.Router();

// Route to serve the New Home page
router.get('/', (req, res) => {
    console.log('Home route hit');
    res.render('home');
});

module.exports = router;
