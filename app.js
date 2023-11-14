const express = require('express');
const mustacheExpress = require('mustache-express');
const mongoose = require('mongoose');
const HomeRoutes = require('./routes/homeRoutes');
const AboutRoutes = require('./routes/aboutRoutes');
const EventsRoutes = require('./routes/eventRoutes');
const AlumniRoutes = require('./routes/alumRoutes');
const ManagerRoutes = require('./routes/managerRoutes');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/alumniPlatform');

// Check for successful connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Function to log connection to MongoDB
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Import your data models
const UserAccount = require('./models/UserAccountModel');
const AlumniRecord = require('./models/AlumRecordModel');
const Event = require('./models/EventModel');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle login action
app.post('/login', async (req, res) => {
    const { userHandle, userPassword, userRole } = req.body;

    // Replace this with your actual authentication logic
    const isAuthenticated = await authenticateUser(userHandle, userPassword, userRole);

    if (isAuthenticated) {
        // Simulate saving the user data to MongoDB collections (replace with your actual database save logic)
        const AlumniRecord = new AlumniRecord({ userHandle, userPassword });
        await AlumniRecord.save();

        const UserAccount = new UserAccount({ userRole });
        await UserAccount.save();

        const redirectURL = `/${userRole}?userHandle=${userHandle}`;
        res.redirect(redirectURL);
    } else {
        res.status(401).send('Invalid userHandle or userPassword.');
    }
});

// Define an authentication function (customize this with your actual authentication logic)
async function authenticateUser(userHandle, userPassword, userRole) {
    if (userHandle === 'sampleUser' && userPassword === 'samplePassword' && userRole === 'Alumni') {
        return true;
    }
    return false;
}

// Handle signup action
app.post('/signup', async (req, res) => {
    const { userHandle, userPassword, userRole } = req.body;
    const existingUser = await UserAccount.findOne({ userHandle, userRole });
    if (existingUser) {
        res.status(400).send('User with this userHandle already exists.');
    } else {
        const user = new UserAccount({ userHandle, userPassword, userRole });
        await user.save();

        // Create a new alumni record if the role is 'newAlumni'
        if (userRole === 'Alumni') {
            const AlumniRecord = new AlumniRecord({ userHandle /* other new alumni data */ });
            await AlumniRecord.save();
        }

        res.redirect(`/${userRole}?userHandle=${userHandle}`);
    }
});

app.post('/Alumni/addEvent', async (req, res) => {
    const eventData = req.body;
    const event = new Event(eventData);

    try {
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).send('Failed to add the new event.');
    }
});

app.put('/Alumni/modifyEvent/:EventId', async (req, res) => {
    const eventId = req.params.EventId;
    const eventData = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { new: true });
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).send('Failed to modify the event.');
    }
});

app.delete('/Alumni/removeEvent/:eventId', async (req, res) => {
    const eventId = req.params.eventId;

    try {
        await Event.findByIdAndRemove(eventId);
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Failed to remove the event.');
    }
});

// ... other app configuration ...
app.get('/newAlumni', (req, res) => {
    const userHandle = req.query.userHandle;
    res.render('newAlumni', { userHandle });
});

app.get('/newManager', (req, res) => {
    const userHandle = req.query.userHandle;
    res.render('newManager', { userHandle });
});

// Route for the home page with a message (update your route accordingly)
app.get('/newHome', (req, res) => {
    // Check if the user has signed up and is waiting for approval
    const waitingForApproval = req.query.waiting === 'true';
    res.render('newHome', { waitingForApproval });
});

// Set up Mustache as the view engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Use the home route
app.use('/', HomeRoutes);
app.use('/About', AboutRoutes);
app.use('/Events', EventsRoutes);
app.use('/Alumni', AlumniRoutes);
app.use('/Manager', ManagerRoutes);

app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

