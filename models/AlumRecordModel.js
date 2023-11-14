// AlumRecordModel.js
const mongoose = require('mongoose');

const AlumniRecordSchema = new mongoose.Schema({
    userHandle: String,
    // Other new alumni record fields (e.g., name, location, newEvents, etc.)
});

const AlumniRecord = mongoose.model('AlumniRecord', AlumniRecordSchema);

module.exports = AlumniRecord;

