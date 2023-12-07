const { Category, MenuItem } = require("../models/foodModel");

async function getAllMenu(req, res) {
    try {
      // Отримайте всі категорії
      const categories = await Category.find();

      // Отримайте всі страви
      const items = await MenuItem.find();

      // Створіть об'єкт для збереження результатів
      const result = {};

      // Пройдіться по кожній категорії і зіберіть страви, які до неї належать
      for (const category of categories) {
        const categoryName = category.name;

        // Фільтруйте страви, які належать до поточної категорії
        const itemsInCategory = items.filter(
          (item) => item.category.toString() === category._id.toString()
        );

        // Форматуйте страви у вказаному форматі
        const formattedItems = itemsInCategory.map((item) => ({
          name: item.name,
          weight: item.weight,
          calories: item.calories,
          category: item.category,
        }));

        // Додайте категорію та відформатовані страви до результату
        result[categoryName] = formattedItems;
      }
      return res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        status: "error",
        message: "Error getting menu",
      });
    }
  }

  module.exports.getAllMenu = getAllMenu;