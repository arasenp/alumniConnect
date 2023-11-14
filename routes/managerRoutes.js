// routes/managerRoutes.js
const express = require('express');
const router = express.Router();

// Route to serve the Manager dashboard
router.get('/', (req, res) => {
    console.log(' Manager dashboard route hit');
    res.render('manager'); // Render the manager.mustache template
});

module.exports = router;

