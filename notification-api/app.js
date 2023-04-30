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
    res.json({ msg: "Improper route. Check API docs plz." });
})

// Export the app.
module.exports = app;