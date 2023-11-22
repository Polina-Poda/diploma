const { Category, MenuItem } = require("../models/foodModel");

class FoodManagment {
  async addCategory(req, res) {
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

  async addMenuItem(req, res) {
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

  async getAllMenu(req, res) {
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
        message: "Помилка при отримані меню",
      });
    }
  }

  async deleteMenuItem(req, res) {
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

  async deleteCategoryAndItems(req, res) {
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

  async editMenuItem(req, res) {
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

  async editCategory(req, res) {
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
}

module.exports = new FoodManagment();
