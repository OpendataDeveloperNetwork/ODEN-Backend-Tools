const nodemailer = require('nodemailer');

const adminEmail = process.env.EMAIL;
const password = process.env.PASSWORD;

/**
 * @summary Notify user if we have received their url submission successfully
 */
function notifyUser(userEmail, msg) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: adminEmail,
        pass: password
      }
    });

    // Set up the email message
    // Need to specify our email
    const mail_configs = {
      from: adminEmail,
      to: userEmail,
      subject: 'Data submission notification',
      text: msg
    };

    transporter.sendMail(mail_configs, function(error, info){
      if(error) {
        console.log(error);
        reject({message: `Email not sent. An error occurred`});
      } else {
        resolve({message:"Email sent succesfully"});
      }
    });
  });
}

module.exports = {
  notifyUser
}
