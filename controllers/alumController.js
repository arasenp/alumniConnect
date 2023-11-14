// controllers/AlumController.js
const Event = require('../models/EventModel');

// Function to render the new alumni dashboard
const getAlumniDashboard = (req, res) => {
    // Retrieve events for the new alumni and render the dashboard view
    Event.find({ userHandle: req.query.userHandle }, (err, Events) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('AlumniDashboard', { userHandle: req.query.userHandle, Events });
        }
    });
};

// Function to add a new event
const addEvent = (req, res) => {
    // Add a new event to the database
    const EventData = req.body;
    console.log('Received new event data:', EventData);
    const Event = Event(EventData);

    Event.save()
        .then((savedEvent) => {
            console.log('New event saved:', savedEvent);
            res.json(savedEvent);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Failed to add the new event.');
        });
};

// Function to modify a new event
const modifyEvent = (req, res) => {
    // Modify a new event in the database by event name
    const EventName = req.params.EventName;
    const EventData = req.body;

    Event.findOneAndUpdate({ eventName: EventName }, EventData, (err, Event) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to modify the new event.');
        } else {
            res.redirect(`/Alumni?userHandle=${EventData.userHandle}`);
        }
    });
};

// Function to remove a new event
const removeEvent = (req, res) => {
    // Remove a new event from the database by event name
    const EventName = req.params.EventName;

    Event.findOneAndRemove({ eventName: EventName }, (err, Event) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to remove the new event.');
        } else {
            res.redirect(`/Alumni?userHandle=${Event.userHandle}`);
        }
    });
};

module.exports = {
    getAlumniDashboard,
    addEvent,
    modifyEvent,
    removeEvent,
};
