const { Category } = require("../models/foodModel");
async function addCategory(req, res) {
    try {
      const categoryName = req.params.categoryName;

      // Перевірте, чи існує категорія з вказаною назвою
      const existingCategory = await Category.findOne({ name: categoryName });
      if (existingCategory) {
        // Категорія вже існує, виведемо помилку
        return res.status(400).json({
          status: "error",
          message: "Категорія з такою назвою вже існує",
        });
      }

      const newCategory = new Category({ name: categoryName });
      const savedCategory = await newCategory.save();

      return res.status(201).json({
        status: "success",
        category: savedCategory,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        status: "error",
        message: "Помилка при додаванні категорії",
      });
    }
  }
  module.exports.addCategory = addCategory;