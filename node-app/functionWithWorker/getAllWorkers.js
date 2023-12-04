const { Workers } = require("../models/workerModel");

async function getAllWorker(req, res) {
  try {
   
    const workersWithRoles = await Workers.find().select('-hashPassword')

    return res.status(201).json({
      status: "success",
      data: workersWithRoles,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Data retrieval error",
    });
  }
}

module.exports.getAllWorker = getAllWorker;





