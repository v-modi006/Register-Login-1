const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const USERS_FILE = 'users.txt';

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read the users file
const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        return data ? JSON.parse(data) : {};
    } catch (err) {
        return {};
    }
};

// Helper function to write to the users file
const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

app.post('/register', (req, res) => {
    const { email, password, ip } = req.body;
    const users = readUsers();

    if (users[email]) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    users[email] = { password, ip };
    writeUsers(users);

    res.status(200).json({ message: 'Registration successful' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    if (!users[email]) {
        return res.status(400).json({ message: 'This email does not exist' });
    }

    if (users[email].password !== password) {
        return res.status(400).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ message: 'Login successful' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
