const { Users } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginWithPassword(req, res) {
  try {
    const { email, password } = req.body;

    const checkEmail = await Users.findOne({ email: email });

    if (!checkEmail) {
      return res
        .status(401)
        .json({ status: "error", message: "Email not found" });
    }
    if(checkEmail.googleStatus == true) return res.status(403).json({status: "error", message: "You are registered with Google"})
    console.log("checkEmail.password",checkEmail.password);

    const passwordMatch = await bcrypt.compare(password, checkEmail.hashPassword);

    console.log("passwordMatch",passwordMatch);
    if (!passwordMatch) {
      return res
        .status(402)
        .json({ status: "error", message: "Password incorrect" });
    }

    const token = jwt.sign(
      {
        Email: email,
        Role: checkEmail.role,
        Name: checkEmail.userName,
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
    return res.status(405).json({ status: "error" });
  }
}
module.exports.loginWithPassword = loginWithPassword;
