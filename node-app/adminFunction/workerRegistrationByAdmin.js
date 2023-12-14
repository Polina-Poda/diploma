const { Workers } = require("../models/workerModel");
const { Tokens } = require("../models/tokenModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

async function workerRegistrationByAdmin(req, res) {
  try {
    const { adminEmail, workerEmail, newRole, workerFirstName, workerLastName } = req.body;

    if (!adminEmail || !workerEmail || !newRole || !workerFirstName || !workerLastName) {
      return res.status(400).json({
        status: "error",
        message: "Not enough data",
      });
    }

    let token = await jwt.sign(
      {
        workerEmail: workerEmail,
        newRole: newRole,
        workerFirstName: workerFirstName,
        workerLastName: workerLastName,
      },
      process.env.LINK_TOKEN,
      { expiresIn: "72h" }
    );

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

    if (checkWorker) {
      return res.status(400).json({
        status: "error",
        message: "Worker email is already exist",
      });
    }

    const worker = new Workers({
      email: workerEmail,
      role: newRole,
      workerFirstName: workerFirstName,
      workerLastName: workerLastName,
    });
    const tokenModel = new Tokens({
      token: token,
      email: workerEmail,
    });


    await worker.save();
    await tokenModel.save();
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
            a.btn {
                color: #000000;
                text-decoration: none;
                display: inline-block;
                padding: 10px 30px; /* Зменшив розмір кнопки */
                border-radius: 3px;
                background-color: #F9F6A5;
                font-family: 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif;
                font-size: 16px;
                text-align: center; /* Вирівнювання тексту у центрі кнопки */
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff;" data-new-gr-c-s-check-loaded="14.1100.0" data-gr-ext-installed="">
        <div style="padding-left: 20px; padding-right: 20px;">
            <p>Шановний(-а) ${workerEmail},<br>З радістю повідомляємо, що Ваш обліковий запис як ${role} у Restaurant Menu було успішно схвалено!</p>
            <p>Для входу натисніть на кнопку</p>
            <div>
                <!--cta button-->
                <a href="${process.env.WEB_LINK}/application_approved/${token}" target="_blank" class="btn">
                    <!--[if mso]>&nbsp;&nbsp;&nbsp;&nbsp;<![endif]-->Activate account<!--[if mso]>&nbsp;&nbsp;&nbsp;&nbsp;<![endif]-->
                </a>
            </div>
            <p>З найкращими побажаннями,<br>Команда Restaurant Menu</p>
        </div>
    </body>
    </html>`;

    sendRoleEditing(text, workerEmail);

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

module.exports.workerRegistrationByAdmin = workerRegistrationByAdmin;
