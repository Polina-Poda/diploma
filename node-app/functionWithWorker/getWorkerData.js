const { Workers } = require("../models/workerModel");

async function getWorkerData(req, res) {
  try {
    const { email } = req.body;

    const checkEmail = await Workers.findOne({ email: email });

    if (!checkEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "Email not found" });
    }

    const workerData = await Workers.find().where("email").equals(email).select('-password -hashPassword');

    return res.status(201).json({
      status: "success",
      data: workerData,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Data retrieval error",
    });
  }
}

module.exports.getWorkerData = getWorkerData;
