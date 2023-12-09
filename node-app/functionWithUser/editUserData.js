const { Users } = require("../models/userModel");

async function editUserData(req, res) {
  try {
    console.log(req.body);
    const { email, name } = req.body;
    
    const checkEmail = await Users.findOne({ email: email });
    
    if (!checkEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "Email not found" });
    }
    
    await Users.updateOne({ email: email }, { $set: { userName: name, email: email } });
    
    res.status(200).json({
      status: "success",
      message: "User updated",
    });
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Data retrieval error",
    });
  }
}

module.exports.editUserData = editUserData;
