const express = require('express');
const axios = require('axios');
const app = express();
const { notifyUser } = require('./sendEmail')


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

app.post('/submitDataNotifier', (req, res) => {
    console.log(req.body);
    console.log(req.body.email);

    if (req.body.email) {
        notifyUser(req.body.email)
    } else{
        console

    }
});

// Export the app.
module.exports = app;


