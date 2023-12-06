const { Workers } = require("../models/workerModel");
const bcrypt = require("bcrypt");

async function applicationApprovedUser(req, res) {
  try {
    const { email, password, duplicatePassword } = req.body;
    if (!email || !password || !duplicatePassword)
      return res.status(400).json({ message: "Not all fields are filled" });

      const checkEmail = await Workers.findOne({ email: email });
        if (!checkEmail) {
            return res.status(404).json({
            status: "error",
            message: "Account not found",
            });
        }
        console.log(checkEmail)
        console.log(checkEmail.password)
        if (checkEmail.password) {
            return res.status(404).json({
            status: "error",
            message: "password already exists",
            });
        }

        if (password !== duplicatePassword) return res.status(400).json({message: "Passwords do not match"})
        const hashPassword = await bcrypt.hash(password, 7);
       await Workers.findOneAndUpdate(
            { email: email },
            { password: password, hashPassword: hashPassword },
        );
  
    return res.status(200).json({ message: "success" });  
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error" });
  }
}

module.exports.applicationApprovedUser = applicationApprovedUser;
