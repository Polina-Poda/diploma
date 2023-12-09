const { Workers } = require("../models/workerModel");
const { Users } = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

async function selfRegistrationWorker(req, res) {
  try {
    const {
      workerFirstName,
      workerLastName,
      password,
      duplicatePassword,
      email,
    } = req.body;
    if (
      !workerFirstName ||
      !workerLastName ||
      !email ||
      !password ||
      !duplicatePassword
    )
      return res.status(400).json({ message: "Not all fields are filled" });

    if (password !== duplicatePassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const checkEmail = await Workers.findOne({ email: email });
    const checkEmailUser = await Users.findOne({ email: email });
    if (checkEmail || checkEmailUser) {
      return res.status(401).json({
        status: "error",
        message: "Email already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 7);
    const newWorker = new Workers({
      workerFirstName: workerFirstName,
      workerLastName: workerLastName,
      email: email,
      hashPassword: hashPassword,
      role: "demo",
    });

    let token = await jwt.sign({
      workerFirstName: workerFirstName,
      workerLastName: workerLastName,
      email: email,
      role: "demo",
    },
     process.env.LINK_TOKEN,
    { expiresIn: "72h" }
  );
     await newWorker.save();

    const text = `<!DOCTYPE html>
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <meta name="robots" content="noindex, nofollow">
          <meta name="referrer" content="no-referrer">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Зміна ролі</title>
          <style type="text/css">
              body { margin: 0; padding: 0; background-color: #ffffff; }
              p { font-family: 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif; font-size: 16px; line-height: 22px; color: #42526E; text-align: left; padding-top: 20px; margin-bottom: 10px; }
              a { color: #0052CC; text-decoration: none; }
          </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff;" data-new-gr-c-s-check-loaded="14.1100.0" data-gr-ext-installed="">
          <p >Шановний(-а)  ${email},
          <br>Дякуємо за реєстрацію у складі команди Restaurant Menu. Ваш обліковий запис наразі перебуває на перегляді.</p>
          <p>Що відбувається далі?
          <br>- Наші адміністратори переглядають надану Вами інформацію.
          <br>- Ви отримаєте сповіщення по електронній пошті, як тільки Ваш обліковий запис буде переглянутий та схвалений.
          <br>- Цей процес зазвичай займає декілька днів.</p>
          <p>Тим часом:
          <br>  - Будь ласка, переконайтеся, що вся подана інформація є точною та повною.
          <br> - Якщо у Вас є будь-які питання або потрібно надати додаткові дані, не соромтеся звертатися до нас за адресою polinapoda5@gmail.com.</p>
         <p>Дякуємо за Ваш інтерес до роботи в Restaurant Menu. Ми з нетерпінням чекаємо можливості співпрацювати.</p>
          <p>З найкращими побажаннями,<br>Команда Restaurant Menu</p>
      </body>
      </html>`;
    sendEmail(text, email);

    return res.status(201).json({
      status: "success",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Registration error",
    });
  }
}

async function sendEmail(text, userEmail) {
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
    subject: "Application status",
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
module.exports.selfRegistrationWorker = selfRegistrationWorker;
