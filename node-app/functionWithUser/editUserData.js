const { Users } = require("../models/userModel");

async function editUserData(req, res) {
  try {
    console.log(req.body);
    const { email, newemail , name } = req.body;

    const checkNewEmail = await Users.findOne({ email: newemail });

    if (checkNewEmail) {
      return res
        .status(402)
        .json({ status: "error", message: "Email already exists" });
    }
    
    await Users.updateOne({ email: email }, { $set: { userName: name, email: newemail } });
    
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
