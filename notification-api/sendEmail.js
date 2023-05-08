const nodemailer = require('nodemailer');

const adminEmail = process.env.EMAIL;
const password = process.env.PASSWORD;

/**
 * @summary Notify user if we have received their url submission successfully
 */
function notifyUser(userEmail, subject, msg) {
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
      subject: subject,
      text: msg,
      html: `<!DOCTYPE html>
      <html>
        <body>
          <header <div style="background-color: #F8F8F8; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background-color: #ffffff; padding: 10px;">
              <img src="https://opendatadev.net/assets/Oden_Web_v3_ODEN_Logo.svg" alt="Logo" width="150" height="50" style="display: block; margin: 0 auto;">
            </div>
            <h1 style="color: #212121; font-size: 28px; font-weight: bold;">${subject}</h1>
            <p style="color: #707070; font-size: 16px;"><pre>${msg}</pre></p>
            <hr style="border: none; border-bottom: 1px solid #E0E0E0; margin: 20px 0;">
            <p style="color: #BDBDBD; font-size: 14px;">This message was sent automatically. Please do not reply.</p>
            </div>
        </body>
      </html> `
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


function approveSubmission(userEmails){
  approvalMessage = `
  
  Hello user,

  This is to notify you that your open data submission has been approved.
  
  Kind regards,
  The ODEN team`;
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
      subject: subject,
      text: msg,
      html: `<!DOCTYPE html>
      <html>
        <body>
          <header <div style="background-color: #F8F8F8; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background-color: #ffffff; padding: 10px;">
              <img src="https://opendatadev.net/assets/Oden_Web_v3_ODEN_Logo.svg" alt="Logo" width="150" height="50" style="display: block; margin: 0 auto;">
            </div>
            <h1 style="color: #212121; font-size: 28px; font-weight: bold;">${subject}</h1>
            <p style="color: #707070; font-size: 16px;"><pre>${msg}</pre></p>
            <hr style="border: none; border-bottom: 1px solid #E0E0E0; margin: 20px 0;">
            <p style="color: #BDBDBD; font-size: 14px;">This message was sent automatically. Please do not reply.</p>
            </div>
        </body>
      </html> `
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
  notifyUser,
  approveSubmission
}
