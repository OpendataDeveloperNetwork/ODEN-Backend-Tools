const express = require('express');
const axios = require('axios');
const app = express();
const { getSubscribers } = require('./emailObserver');


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
 * Route to send email notification to Admins of new open data submissions.
 */
app.post("/submitDataNotifier", (req, res) => {
    const adminEmail = getSubscribers().verifyLinkSubscribers;
    const message = "Notification: Newly submitted open data added to unverified pool."
    // for each email in adminEmail, send message using nodemailer function...
});

// Export the app.
module.exports = app;
