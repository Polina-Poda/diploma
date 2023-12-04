const { Workers } = require("../models/workerModel");
const bcrypt = require("bcrypt");

async function selfRegistrationWorker(req, res) {
  try {
    const { workerFirstName, workerSecondName, password, duplicatePassword, email } = req.body;
    if(!workerFirstName || !workerSecondName || !email || !password || !duplicatePassword ) return res.status(400).json({message: "Not all fields are filled"})

    if (password !== duplicatePassword) return res.status(400).json({message: "Passwords do not match"})

    
    const checkEmail = await Workers.findOne({ email: email });
    if (checkEmail) {
      return res.status(404).json({
        status: "error",
        message: "Email already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 7); 
    const newWorker = new Workers({
        workerFirstName: workerFirstName,
        workerSecondName:workerSecondName,
        email: email,
        hashPassword: hashPassword,
        role: "demo",
        });

      const savedNewWorker = await newWorker.save();

     

    return res.status(201).json({
      status: "success",
      data: savedNewWorker,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Registration error",
    });
  }
}

module.exports.selfRegistrationWorker = selfRegistrationWorker;
