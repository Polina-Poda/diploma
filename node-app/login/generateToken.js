const { Code } = require("../models/sixCodeModel");
const { Users } = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function generateToken(req, res) {
  try {
    const { email, code } = req.body;

    // Перевірка, чи існує код в базі даних
    const check = await Code.findOne({ email: email, code: code, used: false });

    if (!check) {
      return res
        .status(400)
        .json({ status: "error", message: "Credentials incorrect" });
    }

    // Отримання даних користувача з бази даних
    const userData = await Users.findOne({ email: email });

    // Створення JWT-токена
    const token = jwt.sign(
      {
        FullName: userData.userName,
        Email: email,
        Role: userData.role,
      },
      process.env.LINK_TOKEN,
      { expiresIn: "72h" }
    );

    await Code.updateOne({ email: email }, { used: true });

    return res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: "error" });
  }
}

module.exports.generateToken = generateToken;
