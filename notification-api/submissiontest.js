const nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const port = 5000;
require('dotenv').config();

const adminEmail = process.env.EMAIL;
const password = process.env.PASSWORD;


function notifyUser() {

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
            to: 'pchabveka@my.bcit.ca',
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


app.get('/', (req,res) => {
    notifyUser()
    .then(response => res.send(response.message))
    .catch(error => res.status(500).send(error.message))
})


app.listen(port, () => {
    console.log(`nodemail is listening on port local host: ${port}`)
})
