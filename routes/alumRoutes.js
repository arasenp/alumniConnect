// routes/AlumRoute.js
const express = require('express');
const Router = express.Router();
const AlumniController = require('../controllers/alumController');
const EventModel = require('../models/EventModel'); 

// Render new alumni dashboard
Router.get('/', AlumniController.getAlumniDashboard);

// Add a new event
Router.post('/addEvent', async (req, res) => {
    try {
        // Extract new event data from the request body
        const eventData = req.body;

        // Create a new event instance using the NewEvent model
        const newEvent = new EventModel(eventData);

        // Save the new event to the database
        const savedEvent = await newEvent.save();

       // Update the user's alumni status in the database
       await AlumniController.updateUserAlumniStatus(req.user);

       // Redirect the user to the updated alumni dashboard
       res.redirect('/alum/AlumniDashboard');

        // Send a response with the saved new event
        res.json(savedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add the new event to the database.');
    }
});

// Modify a new event
Router.put('/modifyEvent/:EventName', AlumniController.modifyEvent);

// Remove a new event
Router.delete('/removeEvent/:EventName', AlumniController.removeEvent);

module.exports = Router;
