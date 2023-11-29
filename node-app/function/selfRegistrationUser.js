const { Users } = require("../models/userModel");
const bcrypt = require("bcrypt");

async function selfRegistrationUser(req, res) {
  try {
    const { userName, email, password, duplicatePassword } = req.body;
    if(!userName || !email || !password || !duplicatePassword) return res.status(400).json({message: "Not all fields are filled"})

    const checkEmail = await Users.findOne({ email: email });
    if (password !== duplicatePassword) return res.status(400).json({message: "Passwords do not match"})

    if (checkEmail) {
      return res.status(404).json({
        status: "error",
        message: "Email already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 7); 
    const newUser = new Users({
        userName: userName,
        email: email,
        hashPassword: hashPassword,
        role: "user",
        });

      const savedNewUser = await newUser.save();

    return res.status(201).json({
      status: "success",
      data: savedNewUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Registration error",
    });
  }
}

module.exports.selfRegistrationUser = selfRegistrationUser;
