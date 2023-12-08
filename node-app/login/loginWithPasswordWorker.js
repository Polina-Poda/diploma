const { Workers } = require("../models/workerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginWithPasswordWorker(req, res) {
  try {
    const { email, password } = req.body;

    const checkEmail = await Workers.findOne({ email: email });

    if (!checkEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "Email not found" });
    }

    const passwordMatch = await bcrypt.compare(password, checkEmail.hashPassword);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Password incorrect" });
    }

    const token = jwt.sign(
      {
        Email: email,
        Role: checkEmail.role,
        WorkerFirstName: checkEmail.workerFirstName,
        WorkerLastName: checkEmail.workerLastName,
      },
      process.env.LINK_TOKEN,
      { expiresIn: "72h" }
    );

    return res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: "error" });
  }
}
module.exports.loginWithPasswordWorker = loginWithPasswordWorker;
