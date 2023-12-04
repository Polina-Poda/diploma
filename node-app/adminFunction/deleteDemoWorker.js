const {Workers} = require("../models/workerModel");
const nodemailer = require("nodemailer");
const express = require('express');

async function deleteDemoWorker(req, res) {
  try {
    const { adminEmail, workerEmail } = req.body;

    const checkRole = await Workers.findOne({ email: adminEmail }).select("role");

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
        <p>Шановний(-а)  ${workerEmail},
        <br>Дякуємо Вам за проявлений інтерес до роботи в команді Restaurant Menu та за час, який Ви приділили своїй заявці.</p>
        <p>Після ретельного розгляду ми з жалем повідомляємо Вам, що на цей момент ми не можемо схвалити Вашу реєстрацію.</p>
        <p>Що Ви можете зробити:
       <br> - Ми заохочуємо Вас подавати заявку знову в майбутньому, оскільки наші потреби можуть змінитися.
       <br> - Слідкуйте за нашою сторінкою кар'єри для майбутніх вакансій, які відповідають Вашому набору навичок та досвіду.</p>
        <p>Ще раз дякуємо Вам за розгляд можливості кар'єри у нас. Якщо у Вас є якісь питання або Ви хочете отримати відгук щодо Вашої заявки, будь ласка, зв'яжіться з нами ${adminEmail}.</p>
        <p>З найкращими побажаннями,<br>Команда Restaurant Menu</p>
    </body>
    </html>`;
    sendDelete(text, workerEmail);


    const deleteWorker = await Workers.deleteOne({ email: workerEmail });

    

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

async function sendDelete(text, userEmail) {
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
      subject: "Application denied",
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
  
  module.exports.deleteDemoWorker = deleteDemoWorker;
  