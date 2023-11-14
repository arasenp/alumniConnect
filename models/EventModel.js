// EventModel.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventName: String,
    eventDate: Date,
    eventDescription: String,
    eventType: {
        type: String,
        enum: ['professional', 'networking', 'campus'],
    },
    // You can add more fields as needed
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;

