const { Category } = require("../models/foodModel");

async function editCategory(req, res) {
    try {
        const categoryId = req.params.categoryId; // Отримайте ідентифікатор страви з запиту
        const name = req.params.name; // Отримайте ідентифікатор страви з запиту
  
        // Знайдіть страву за ідентифікатором
        const existingCategory = await Category.findById(categoryId);
  
        if (!existingCategory) {
          console.error(`Категорії з ідентифікатором ${itemId} не знайдена`);
          return res.status(404).json({
            status: "error",
            message: `Категорії з ідентифікатором ${itemId} не знайдена`,
          });
        }
  
         // Перевірте, чи існує категорія з вказаною назвою взагалі (окрім поточної категорії)
      const existingCategoryByName = await Category.findOne({
        name: name,
        _id: { $ne: categoryId }, // Виключає поточний ідентифікатор категорії
      });
  
      if (existingCategoryByName) {
        return res.status(400).json({
          status: "error",
          message: "Категорія з такою назвою вже існує",
        });
      }
  
        existingCategory.name = name;
  
        const updatedCategory = await existingCategory.save();
  
        return res.status(200).json({
          status: "success",
          data: updatedCategory,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: "error",
          message: "Помилка при оновленні даних страви",
        });
      }
  }

  module.exports.editCategory = editCategory;