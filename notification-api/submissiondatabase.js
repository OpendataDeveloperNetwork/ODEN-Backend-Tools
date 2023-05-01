

const nodemailer = require('nodemailer');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require("./service-key.json");
const port = 5000;


const adminEmail = process.env.EMAIL;
const password = process.env.PASSWORD;
// Create a new Express app
const app = express();

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Initialize Firebase Admin SDK
try {
  
  admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.log('Error initializing Firebase Admin SDK', error);
}

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
            text: `Hello user,
  
            Your data has been submitted successfully. Our Admin is reviewing it and you will be notified of your submission status as soon as possible.
            Thank you for your submission!
  
            Kind regards,
            The ODEN team`
          };

          transporter.sendMail(mail_configs, function(error, info){
            if(error) {
                console.log(error)
                return reject({message: `An error occurred`})
            }return resolve({message:"Email sent succesfully"})
          });

    })
    }


    // change this to submitDataNotifier when the page is available, and to app.post
app.get('/', (req, res) => {
    // Extract the form data from the request body
  //   Still need to confirm what field are on the submission form
  console.log('inside');
    // const { userEmail } = req.body;
    const userEmail  = 'pchabveka@my.bcit.ca'

    notifyUser(userEmail)
    .then(response => res.send(response.message))
    .catch(error => res.status(500).send(error.message))

});

app.listen(port, () => {
    console.log(`nodemail is listening on port local host: ${port}`)
})

