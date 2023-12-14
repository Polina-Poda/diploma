const { Workers } = require("../models/workerModel");
const { Tokens } = require("../models/tokenModel");

async function getToken(req, res) {
  try {
    const token = req.params;
    console.log(token)
    const getUser = await Tokens.findOne({ token: token.token })

    if (!getUser) {
      return res.status(404).json({
        status: "error",
        message: "token not found",
      });
    }
    console.log(getUser.token)

    const checkRole = await Workers.findOne({ email: getUser.email })

    if (!checkRole) {
      return res.status(404).json({
        status: "error",
        message: "Email not found",
      });
    }
    await Tokens.findOneAndDelete({ token: token.token });
    

    return res.status(201).json({
      status: "success",
      data: checkRole,
    });
  
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Data retrieval error",
    });
  }
}

module.exports.getToken = getToken;
