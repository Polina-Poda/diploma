
const nodemailer = require("nodemailer");


async function sendEmail(req, res) {
  try {
    const { email, text } = req.body;
    
    let newMail = `
    <h1>Feedback from ${email}</h1>
    <h2>Message:</h2>
    <p>${text}</p>
    `;

    

    


    sendRoleEditing(newMail, "sdemchenko70@gmail.com");

    res.status(200).json({
      status: "success",
      message: "Worker was successfully registered",
      token: token,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
}



async function sendRoleEditing(text, userEmail) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "polinapoda5@gmail.com",
        pass: "jurp wecg svpk irsd",
      },
    });
  
    var mailOptions = {
      from: "Restaurant Menu <polinapoda5@gmail.com>",
      to: userEmail,
      subject: "Application approved ",
      html: text,
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
  
  module.exports.sendEmail = sendEmail;