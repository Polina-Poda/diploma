const { Category, MenuItem } = require("../models/foodModel");

async function addMenuItem(req, res) {
    try {
      const {categoryName, name, weight, calories, price, description} = req.body;
  
      if (!categoryName || !name || !weight || !calories || !price || !description) {
        return res.status(400).json({
          status: "error",
          message: "Всі поля повинні бути заповнені",
        });
      }

      const сategory = await Category.findOne({ name: categoryName });

      if (!сategory) {
        console.error("Категорія не знайдена");
        return res.status(404).json({
          status: "error",
          message: "Категорія не знайдена",
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
          message: "Страва з такою назвою вже існує",
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

      // Збережіть страву в базу даних за допомогою `await`
      const savedCategoryVariety = await newCategoryVariety.save();

      console.log("Піца додана:", savedCategoryVariety);
      return res.status(201).json({
        status: "success",
        categoryVariety: savedCategoryVariety,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        status: "error",
        message: "Помилка при додаванні страви",
      });
    }
  }
  module.exports.addMenuItem = addMenuItem;