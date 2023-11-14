const express = require('express');
const Router = express.Router();

// Route to serve the New About Us page
Router.get('/', (req, res) => {
    console.log('About route hit');
    res.render('about');
});

Router.get('/confirmation', (req, res) => {
    // Render the new confirmation page with the message
    res.render('Confirmation', { Message: req.query.Message });
});

module.exports = Router;
