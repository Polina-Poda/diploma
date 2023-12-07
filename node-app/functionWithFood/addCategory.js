const { Category } = require("../models/foodModel");
const { Workers } = require("../models/workerModel");
async function addCategory(req, res) {
    try {
      const {categoryName, email} = req.body;
  
      const checkEmail = await Workers.findOne({ email: email });

      if (!checkEmail) { 
        return res.status(400).json({
          status: "error",
          message: "Email not found",
        });
      }
      console.log(checkEmail.role );
      if (checkEmail.role !== "admin" && checkEmail.role !== "chef") {
        return res.status(400).json({
          status: "error",
          message: "You do not have permission",
        });
      }

    
      // Перевірте, чи існує категорія з вказаною назвою
      const existingCategory = await Category.findOne({ name: categoryName });
      if (existingCategory) {
        // Категорія вже існує, виведемо помилку
        return res.status(400).json({
          status: "error",
          message: "A category with that name already exists",
        });
      }

      const newCategory = new Category({ name: categoryName });
      await newCategory.save();

      return res.status(201).json({
        status: "success"
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        status: "error",
        message: "Error adding category",
      });
    }
  }
  module.exports.addCategory = addCategory;