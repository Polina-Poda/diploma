const { Category, MenuItem } = require("../models/foodModel");
const { Workers } = require("../models/workerModel");

async function addMenuItem(req, res) {
    try {
      const {categoryName, name, weight, calories, price, description, email} = req.body;
  
      if (!categoryName || !name || !weight || !price || !description || !email) {
        return res.status(400).json({
          status: "error",
          message: "All fields must be filled",
        });
      }
      console.log(categoryName, name, weight,  price, description, email);
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
  
      const сategory = await Category.findOne({ name: categoryName });

      if (!сategory) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }

      // Перевірте, чи існує страва з вказаною назвою взагалі
      const existingMenuItemByName = await MenuItem.findOne({
        name: name,
      });

      if (existingMenuItemByName) {
        // Страва вже існує в межах вибраної категорії, виведемо помилку
        return res.status(400).json({
          status: "error",
          message: "A dish with that name already exists",
        });
      }

      // Тепер маємо ідентифікатор категорії
      const сategoryId = сategory._id;

      // Створіть новий вид піци та призначте йому категорію
      const newCategoryVariety = new MenuItem({
        name: name,
        weight: weight,
        calories: calories,
        description: description,
        price: price,
        category: сategoryId, // Встановлюємо категорію за допомогою ідентифікатора
      });

      await newCategoryVariety.save();

      return res.status(201).json({
        status: "success"
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        status: "error",
        message: "Error adding food",
      });
    }
  }
  module.exports.addMenuItem = addMenuItem;