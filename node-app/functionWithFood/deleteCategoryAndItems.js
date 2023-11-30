const { Category, MenuItem } = require("../models/foodModel");

async function deleteCategoryAndItems(req, res) {
    try {
        const categoryId = req.params.categoryId; // Отримайте ідентифікатор категорії з запиту
  
        // Знайдіть всі страви, які належать до цієї категорії
        const itemsInCategory = await MenuItem.find({ category: categoryId });
  
        // Видаліть всі знайдені страви
        for (const item of itemsInCategory) {
          await MenuItem.findByIdAndRemove(item._id);
        }
  
        // Видаліть саму категорію
        await Category.findByIdAndRemove(categoryId);
  
        return res.status(200).json({
          status: "success",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: "error",
          message: "Помилка при видаленні категорії та страв",
        });
      }
  }

  module.exports.deleteCategoryAndItems = deleteCategoryAndItems;