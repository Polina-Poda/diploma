const { MenuItem } = require("../models/foodModel");

async function deleteMenuItem(req, res) {
    try {
      const itemId = req.params.itemId; // Отримайте ідентифікатор страви з запиту

      // Перевірте, чи існує страва з таким ідентифікатором
      const existingItem = await MenuItem.findById(itemId);

      if (!existingItem) {
        console.error(`Страва з ідентифікатором ${itemId} не знайдена`);
        return res.status(404).json({
          status: "error",
          message: `Страва з ідентифікатором ${itemId} не знайдена`,
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
        message: "Помилка при видаленні страви",
      });
    }
  }

  module.exports.deleteMenuItem = deleteMenuItem;