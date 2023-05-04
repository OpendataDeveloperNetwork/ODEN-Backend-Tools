const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const { getSubscribers } = require('./emailObserver');
const { notifyUser } = require('./sendEmail')

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


/**
 * Route that sends email notification to user(submitter) and admins of newly submitted data sets.
 */
app.post('/submitDataNotifier', (req, res) => {
    console.log(`User email posted to /submitDataNotifier: ${req.body.email}`);

    userMessage = `
    Hello user,

    Your open data information has been submitted successfully. Our Admins are reviewing it and you will be notified of your submission status as soon as possible.
    Thank you for your submission!

    Kind regards,
    The ODEN team`;

    adminMessage = `
    Hello admins,
    
    A user has submitted new data, please login and approve/reject the dataset.
    
    Kind regards,
    The ODEN team`;

    if (req.body.email) {
        notifyUser(req.body.email, userMessage).then((result) => {
            console.log(result.message);
        }).catch((error) => {
            console.error(error.message);
        });
    } else {
        console.log("/submitDataNotifier received no email...");
    }

    // Get list of admins 
    const adminEmails = getSubscribers().adminVerifyLinks;
    if (!adminEmails.length) {
        console.log("/submitDataNotifier has no Admins subscribed to receiver new data submission.");
    }
    // Send an email to each administrator that has subscribed to receive notifications of newly submitted open data.
    adminEmails.forEach(email => {
        notifyUser(email, adminMessage);
        console.log(`/submitDataNotifier send notification to admin: ${email}`);
    });
});

// Export the app.
module.exports = app;
