const { Category, MenuItem} = require('../models/foodModel');

class FoodManagment{
    async addCategory(req, res) {
        try {
            const categoryName = req.params.categoryName;
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
              const categoryName = req.params.categoryName;
              const name = req.params.name;
              const weight = req.params.weight;
              const calories = req.params.calories;
          
              const pizzaCategory = await Category.findOne({ name: categoryName });
          
              if (!pizzaCategory) {
                console.error('Категорія "Піца" не знайдена');
                return res.status(404).json({
                  status: "error",
                  message: "Категорія не знайдена",
                });
              }
          
              // Тепер маємо ідентифікатор категорії "Піца"
              const pizzaCategoryId = pizzaCategory._id;
          
              // Створіть новий вид піци та призначте йому категорію "Піца"
              const newPizzaVariety = new MenuItem({
                name: name,
                weight: weight,
                calories: calories,
                category: pizzaCategoryId, // Встановлюємо категорію "Піца" за допомогою ідентифікатора
              });
          
              // Збережіть страву в базу даних за допомогою `await`
              const savedPizzaVariety = await newPizzaVariety.save();
          
              console.log('Піца додана:', savedPizzaVariety);
              return res.status(201).json({
                status: "success",
                pizzaVariety: savedPizzaVariety,
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
              const itemsInCategory = items.filter((item) => item.category.toString() === category._id.toString());

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
              const { name, weight, calories } = req.body; // Отримайте нові дані для страви з тіла запиту
          
              // Знайдіть страву за ідентифікатором
              const existingItem = await MenuItem.findById(itemId);
          
              if (!existingItem) {
                console.error(`Страва з ідентифікатором ${itemId} не знайдена`);
                return res.status(404).json({
                  status: "error",
                  message: `Страва з ідентифікатором ${itemId} не знайдена`,
                });
              }
          
              // Оновіть дані страви з новими даними
              existingItem.name = name;
              existingItem.weight = weight;
              existingItem.calories = calories;
          
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