const { Users } = require("../models/userModel");
const { Foods } = require("../models/foodModel");

async function addFood(req, res) {
  try {
    const { email, foodName } = req.body;
    if (!email || !foodName)
      return res.status(400).json({ message: "Not all fields are filled" });
      const checkEmail = await Users.findOne({ email: email });
        if (!checkEmail) {
            return res
            .status(401)
            .json({ status: "error", message: "Email not found" });
        }
    const checkFood = await Foods.findOne({ foodName: foodName });
    if (!checkFood) {
      return res.status(401).json({
        status: "error",
        message: "Food not found",
      });
    }
    await Users.updateOne(
      { email: email },
      { $push: { favorites: foodName } }
    );

  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Data retrieval error",
    });
  }
}

module.exports.addFood = addFood;
