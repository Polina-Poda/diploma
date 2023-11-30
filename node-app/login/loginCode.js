const { Code } = require("../models/sixCodeModel");
const { Users } = require("../models/userModel");

async function sixDigitCodeGeneration(req, res) {
  try {
    const { email } = req.body;

    const checkEmail = await Users.findOne({ email: email });

    if (!checkEmail) {
      return res.status(400).json({ status: 'error', message: 'Email not found' });
    }

    let sixDigitCode = Math.floor(100000 + Math.random() * 900000);

    const checkCode = await Code.findOne({ email: email });
  
    if (!checkCode) {
      await Code.create({ code: sixDigitCode, email: email });
    } else {
      await Code.updateOne({ email: email }, { code: sixDigitCode });
    }

    return res.status(200).json({
      status: 'success',
      code: sixDigitCode,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: 'error' });
  }
}

module.exports.sixDigitCodeGeneration = sixDigitCodeGeneration;
