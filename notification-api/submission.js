
// // Create a new Express app
// const app = express();
// const nodemailer = require('nodemailer');
// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const admin = require('firebase-admin');
// const adminEmail = process.env.EMAIL;
// const password = process.env.PASSWORD;

// // Initialize Firebase Admin SDK
// try {
//   const serviceAccount = require("./service-key.json");
//   admin.initializeApp({
//       credential: admin.credential.cert(serviceAccount)
//   });
// } catch (error) {
//   console.log('Error initializing Firebase Admin SDK', error);
// }


// // Set up body-parser middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Set up a route to handle data submissions
// app.post('/submitDataNotifier', (req, res) => {
//   // Extract the form data from the request body
// //   Still need to confirm what field are on the submission form
//   const { name, email, message, userId } = req.body;

//   // Retrieve the user document from Firestore
//   admin.firestore().collection('users').doc(userId).get()
//     .then(doc => {
//       if (!doc.exists) {
//         console.log('User not found in Firestore.');
//         res.status(404).send('User not found.');
//       } else {
//         const userData = doc.data();

//         // Set up a nodemailer transporter using your SMTP settings, found in gmail
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           host: 'smtp.example.com',
//           port: 587,
//           secure: false,
//           auth: {
//             user: 'YOUR_SMTP_USERNAME',
//             pass: 'YOUR_SMTP_PASSWORD'
//           }
//         });

//         // Set up the email message
//         // Need to specify our email
//         const mailOptions = {
//           from: 'oden@gmail.com',
//           to: userData.email,
//           subject: 'Data submission notification',
//           text: `Hello ${name},

//           Your data has been submitted successfully. Our Admin is reviewing it and you will be notified of your submission status as soon as possible.
//           Thank you for your submission!

//           Kind regards,
//           The ODEN team`
//         };

//         // Send the email message
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             console.log(error);
//             res.status(500).send('Failed to send email.');
//           } else {
//             console.log('Email sent: ' + info.response);
//             res.status(200).send('Form submitted successfully.');
//           }
//         });
//       }
//     })
//     .catch(error => {
//       console.log('Failed to retrieve user data from Firestore.', error);
//       res.status(500).send('Failed to retrieve user data from Firestore.');
//     });
// });

// // Start the server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}.`);
// });
