
const nodemailer = require("nodemailer");


async function sendEmail(req, res) {
  try {
    const { email, text } = req.body;
    
    let newMail = `
    <h1>Feedback from ${email}</h1>
    <h2>Message:</h2>
    <p>${text}</p>
    `;

    

    


    sendFeedbackEmail(newMail);

    res.status(200).json({
      status: "success",      
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
}



async function sendFeedbackEmail(feedbackText) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'polinapoda5@gmail.com',
        pass: 'jurp wecg svpk irsd',
      },
    });
  
    const mailOptions = {
      from: 'Restaurant Menu <polinapoda5@gmail.com>',
      to: 'polinapoda5@gmail.com', // Replace with your email address
      subject: 'Feedback',
      html: feedbackText,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error(error);
    }
  }
  
  module.exports.sendEmail = sendEmail;