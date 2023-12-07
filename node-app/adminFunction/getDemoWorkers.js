const { Workers } = require("../models/workerModel");

async function getDemoWorkers(req, res) {
  try {
   const  email = req.params.email;
   const checkRole = await Workers.findOne({ email: email }).select('role');

   if (!checkRole) {
    return res.status(400).json({
      status: "error",
      message: "Email not found",
    });
  }
  
   if (checkRole.role !== "admin") {
      return res.status(400).json({
        status: "error",
        message: "You are not an admin",
      });
    }
  
    const demoUserData = await Workers.find({ role: "demo" }).select('-hashPassword');

    return res.status(201).json({
      status: "success",
      data: demoUserData,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Data retrieval error",
    });
  }
}

module.exports.getDemoWorkers = getDemoWorkers;
