const nodemailer = require('nodemailer');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');


const adminEmail = process.env.EMAIL;
const password = process.env.PASSWORD;
// Create a new Express app
const app = express();

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * @summary Notify user if we have received their url submission successfully
 */
function notifyUser(userEmail) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: adminEmail,
              pass: password
            }
          })
        // Set up the email message
        // Need to specify our email
        const mail_configs = {
            from: adminEmail,
            to: userEmail,
            subject: 'Data submission notification',
            text: `
            Hello user,
  
            Your url (data) has been submitted successfully. Our Admin is reviewing it and you will be notified of your submission status as soon as possible.
            Thank you for your submission!
  
            Kind regards,
            The ODEN team`
          };

          transporter.sendMail(mail_configs, function(error, info){
            if(error) {
                console.log(error)
                return reject({message: `Email not sent. An error occurred`})
            }return resolve({message:"Email sent succesfully"})
          })
    })
    }

    module.exports = {
      notifyUser
    }
