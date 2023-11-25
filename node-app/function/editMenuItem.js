const { MenuItem } = require("../models/foodModel");

async function editMenuItem(req, res) {
    try {
        const itemId = req.params.itemId; // Отримайте ідентифікатор страви з запиту
        const { name, weight, calories, price, description } = req.body; // Отримайте нові дані для страви з тіла запиту
  
        // Знайдіть страву за ідентифікатором
        const existingItem = await MenuItem.findById(itemId);
  
        if (!existingItem) {
          console.error(`Страва з ідентифікатором ${itemId} не знайдена`);
          return res.status(404).json({
            status: "error",
            message: `Страва з ідентифікатором ${itemId} не знайдена`,
          });
        }
  
        const existingMenuItemByName = await MenuItem.findOne({
          name: name,
          _id: { $ne: itemId }, // Виключає поточний ідентифікатор категорії
        });
    
        if (existingMenuItemByName) {
          return res.status(400).json({
            status: "error",
            message: "Страва з такою назвою вже існує",
          });
        }
  
         // Оновіть дані страви з новими даними, якщо вони були передані
      if (name) existingItem.name = name;
      if (weight) existingItem.weight = weight;
      if (calories) existingItem.calories = calories;
      if (price) existingItem.price = price;
      if (description) existingItem.description = description;
  
        // Збережіть оновлену страву
        const updatedItem = await existingItem.save();
  
        return res.status(200).json({
          status: "success",
          data: updatedItem,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: "error",
          message: "Помилка при оновленні даних страви",
        });
      }
  }

  module.exports.editMenuItem = editMenuItem;