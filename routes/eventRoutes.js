// routes/eventRoutes.js
const express = require('express');
const router = express.Router();

// Route to serve the New Events page
router.get('/', (req, res) => {
    try {
        // Log that the route has been hit
        console.log('Events route hit');

        // Render the Events page
        res.render('event');
    } catch (error) {
        console.error('Error rendering Events page:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

