const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const eventsFile = path.join(__dirname, 'data', 'events.json');

// Helper function to read events from JSON file
const readEventsFromFile = () => {
    const data = fs.readFileSync(eventsFile, 'utf8');
    return JSON.parse(data);
};

// Helper function to write events to JSON file
const writeEventsToFile = (events) => {
    fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2), 'utf8');
};

// Route to display events
app.get('/events', (req, res) => {
    const events = readEventsFromFile();
    res.render('events', { events });
});

// Route to handle event registration
app.post('/register', (req, res) => {
    const { name, email, eventName } = req.body;
    const registration = { name, email, eventName };
    const registrationsFile = path.join(__dirname, 'data', 'registrations.json');

    let registrations = [];
    if (fs.existsSync(registrationsFile)) {
        registrations = JSON.parse(fs.readFileSync(registrationsFile, 'utf8'));
    }
    registrations.push(registration);

    fs.writeFileSync(registrationsFile, JSON.stringify(registrations, null, 2), 'utf8');
    res.redirect('/events');
});

// Admin dashboard
app.get('/admin', (req, res) => {
    const events = readEventsFromFile();
    res.render('admin', { events });
});

// Add new event
app.post('/admin/add', (req, res) => {
    const { name, date, description } = req.body;
    const events = readEventsFromFile();
    events.push({ name, date, description });
    writeEventsToFile(events);
    res.redirect('/admin');
});

// Edit existing event
app.post('/admin/edit/:id', (req, res) => {
    const { name, date, description } = req.body;
    const events = readEventsFromFile();
    events[req.params.id] = { name, date, description };
    writeEventsToFile(events);
    res.redirect('/admin');
});

// Delete event
app.post('/admin/delete/:id', (req, res) => {
    const events = readEventsFromFile();
    events.splice(req.params.id, 1);
    writeEventsToFile(events);
    res.redirect('/admin');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

app.get('/', (req, res) => {
    res.redirect('/events');
});