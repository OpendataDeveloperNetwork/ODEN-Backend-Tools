const express = require('express');
const axios = require('axios');
const app = express();
const { getAdminEmails, adminEmailObserver } = require('./emailObserver');


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

/**
 * This is a temporary route to test whether or not the admin email list gets updated.
 */
app.post("/getAdminEmails", (req, res) => {
    res.json({adminEmailList: getAdminEmails()});
})

/**
 * Route to send email notification to Admins of new open data submissions.
 */
app.post("/submitDataNotifier", (req, res) => {

});

// Export the app.
module.exports = app;
