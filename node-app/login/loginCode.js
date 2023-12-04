const { Code } = require("../models/sixCodeModel");
const { Users } = require("../models/userModel");
const nodemailer = require("nodemailer");

async function sixDigitCodeGeneration(req, res) {
  try {
    const { email } = req.body;

    const checkEmail = await Users.findOne({ email: email });

    if (!checkEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "Email not found" });
    }

    let sixDigitCode = Math.floor(100000 + Math.random() * 900000);

    const checkCode = await Code.findOne({ email: email });

    if (!checkCode) {
      await Code.create({ code: sixDigitCode, email: email });
    } else {
      await Code.updateOne({ email: email }, { code: sixDigitCode });
    }

    const html = `<!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="robots" content="noindex, nofollow">
        <meta name="referrer" content="no-referrer">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Відновлення доступу</title>
        <style type="text/css">
            body { margin: 0; padding: 0; background-color: #ffffff; }
            p { font-family: 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif; font-size: 16px; line-height: 22px; color: #42526E; text-align: left; padding-top: 20px; margin-bottom: 10px; }
            a { color: #0052CC; text-decoration: none; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff;" data-new-gr-c-s-check-loaded="14.1100.0" data-gr-ext-installed="">
        <p>Вітаємо,
        <br>Ви отримали це повідомлення через те, що вирішили скористатися одноразовим кодом для входу в свій обліковий запис Restaurant Menu.</p>
        <p>Код для входу: <strong>${sixDigitCode}</strong></p>
        <p>Цей код дійсний лише для поточного входу і не впливає на ваш пароль.</p>
        <p> Якщо ви не здійснювали цей запит, проігноруйте це повідомлення.</p>
        <p>З найкращими побажаннями,<br>Команда Restaurant Menu</p>
    </body>
    </html>`;

    await sendSixDigitCode(html, email);
    return res.status(200).json({
      status: "success",
      code: sixDigitCode,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: "error" });
  }
}

async function sendSixDigitCode(text, userEmail) {
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
    subject: "Authorization code",
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
module.exports.sixDigitCodeGeneration = sixDigitCodeGeneration;
