const express = require('express');
const axios = require('axios');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO - Add routes here.

/**
 * Catch routes that don't exist.
 */
app.get('*', function (req, res) {
    const errorMessage = `Cannot GET ${req.url}`;
    res.status(404).send(errorMessage);
});

// Export the app.
module.exports = app;