const nodemailer = require("nodemailer");
const { Workers } = require("../models/workerModel");

async function roleEditing(req, res) {
  try {
    const { adminEmail, workerEmail, newRole } = req.body;
    const checkRole = await Workers.findOne({ email: adminEmail }).select(
      "role"
    );

    if (!checkRole) {
      return res.status(400).json({
        status: "error",
        message: "Email not found",
      });
    }

    if (checkRole.role !== "admin") {
      return res.status(400).json({
        status: "error",
        message: "You are not an admin",
      });
    }

    const checkWorker = await Workers.findOne({ email: workerEmail });

    if (!checkWorker) {
      return res.status(400).json({
        status: "error",
        message: "Worker email not found",
      });
    }

    if (checkWorker.role !== "demo") {
      return res.status(400).json({
        status: "error",
        message: "Worker is not a demo",
      });
    }

    const updateRole = await Workers.findOneAndUpdate(
      { email: workerEmail },
      { role: newRole }
    );

    let role = "";
    if (newRole === "admin") {
      role = "адміністратора";
    } else if (newRole === "manager") {
      role = "менеджера";
    } else if (newRole === "waiter") {
      role = "офіціанта";
    } else if (newRole === "cook") {
      role = "кухаря";
    } else if (newRole === "chef") {
      role = "шеф-кухаря";
    }

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
        <p >Шановний(-а)  ${workerEmail},
        <br>З радістю повідомляємо, що Ваш обліковий запис як ${role} у Restaurant Menu було успішно схвалено!</p>
        <p>Ласкаво просимо до нашої команди! Ми з нетерпінням чекаємо на Ваш внесок у наш колектив та віримо, що Ваш досвід та навички зроблять значний вплив на наш успіх.</p>
        <p>З найкращими побажаннями,<br>Команда Restaurant Menu</p>
    </body>
    </html>`;
    sendRoleEditing(text, workerEmail);

    return res.status(201).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Data retrieval error",
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

module.exports.roleEditing = roleEditing;
