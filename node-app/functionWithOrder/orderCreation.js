const { Order } = require('../models/orderModel');
const { MenuItem } = require('../models/foodModel');

async function orderCreation(req, res) {
  try {
    // Отримуємо масив айді страв з запиту
    const { itemIds } = req.body;

    // Перевірка наявності айді страв у запиті
    if (!itemIds || !Array.isArray(itemIds)) {
      return res.status(400).json({ message: 'Invalid itemIds format' });
    }

    // Запит до бази даних за допомогою Mongoose
    const menuItems = await MenuItem.find({ _id: { $in: itemIds } }).select('_id price name').exec();

console.log(menuItems);
     // Створення нового об'єкта Order
     const newOrder = new Order({
        items: menuItems.map(item => ({
            idMenuItem: item._id,
            priceMenuItem: item.price,
            nameMenuItem: item.name,

          })),
      });
  
      // Збереження нового об'єкта Order в базі даних
      const savedOrder = await newOrder.save();

    // Повертаємо дані по стравам
    return res.status(200).json({ status: 'success', data: savedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

module.exports.orderCreation = orderCreation;
