const { MenuItem } = require("../models/foodModel");
const { Workers } = require("../models/workerModel");

async function deleteMenuItem(req, res) {
    try {
      const {itemId, email} = req.body; 

      const checkEmail = await Workers.findOne({ email: email });

      if (!checkEmail) { 
        return res.status(400).json({
          status: "error",
          message: "Email not found",
        });
      }
      if (checkEmail.role !== "admin" && checkEmail.role !== "chef") {
        return res.status(400).json({
          status: "error",
          message: "You do not have permission",
        });
      }
      // Перевірте, чи існує страва з таким ідентифікатором
      const existingItem = await MenuItem.findById(itemId);

      if (!existingItem) {
        return res.status(404).json({
          status: "error",
          message: "Food not found",
        });
      }

      // Видаліть страву за ідентифікатором
      await MenuItem.findByIdAndRemove(itemId);

      return res.status(200).json({
        status: "success",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Error deleting food",
      });
    }
  }

  module.exports.deleteMenuItem = deleteMenuItem;