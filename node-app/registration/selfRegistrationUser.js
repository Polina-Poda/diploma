const { Users } = require("../models/userModel");
const { Workers } = require("../models/workerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function selfRegistrationUser(req, res) {
  try {
    const { userName, email, password, duplicatePassword } = req.body;
    if(!userName || !email || !password || !duplicatePassword) return res.status(400).json({message: "Not all fields are filled"})

  
    const checkEmail = await Users.findOne({ email: email });
    const checkEmailWoker = await Workers.findOne({ email: email });
    if (password !== duplicatePassword) return res.status(400).json({message: "Passwords do not match"})


    if (checkEmail || checkEmailWoker) {
      return res.status(401).json({
        status: "error",
        message: "Email already exists",
      });
    }
    let token = await jwt.sign(
      {
        userName: userName,
        email: email
      },
      process.env.LINK_TOKEN,
      { expiresIn: "72h" }
    );

    const hashPassword = await bcrypt.hash(password, 7); 
    const newUser = new Users({
        userName: userName,
        email: email,
        hashPassword: hashPassword,
        role: "user",
        googleStatus: false,        
        });

      const savedNewUser = await newUser.save();

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

module.exports.selfRegistrationUser = selfRegistrationUser;
