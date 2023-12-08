const { Users } = require("../models/userModel");
const { MenuItem } = require("../models/foodModel");
async function removeFood(req, res) {
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
  
      const checkFood = await MenuItem.findOne({ name: foodName });
      if (!checkFood) {
        return res.status(401).json({
          status: "error",
          message: "Food not found",
        });
      }
  
      await Users.updateOne(
        { email: email },
        { $pull: { favorites: { foodName: foodName } } }
      );
  
      res.status(200).json({
        status: "success",
        message: "Food removed",
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        status: "error",
        message: "Data retrieval error",
      });
    }
  }
  

module.exports.removeFood = removeFood;
