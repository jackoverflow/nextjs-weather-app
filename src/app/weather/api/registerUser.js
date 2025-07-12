const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.post('/api/register_user/', (req, res) => {
    // Registration logic here
});

module.exports = app; 