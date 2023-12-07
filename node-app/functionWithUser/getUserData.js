const { Users } = require("../models/userModel");

async function getUserData(req, res) {
  try {
    console.log(req.body);
    const { email } = req.body;

    const checkEmail = await Users.findOne({ email: email });

    if (!checkEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "Email not found" });
    }

    const userData = await Users.find({ email: email }).select('-password -hashPassword');

    return res.status(201).json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Data retrieval error",
    });
  }
}

module.exports.getUserData = getUserData;
