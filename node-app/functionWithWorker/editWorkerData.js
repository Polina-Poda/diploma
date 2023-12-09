const { Workers } = require("../models/workerModel");
async function editUserData(req, res) {
  try {
    console.log(req.body);
    const { email, newemail , firstName , lastName} = req.body;
    
    await Workers.updateOne({ email: email }, { $set: {workerFirstName: firstName, workerLastName : lastName   , email: newemail } });
    
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
