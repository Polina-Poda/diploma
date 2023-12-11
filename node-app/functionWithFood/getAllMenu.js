const { Category, MenuItem } = require("../models/foodModel");

async function getAllMenu(req, res) {
    try {      
      const categories = await Category.find();
      const items = await MenuItem.find();
      const result = [];
      
      for (const category of categories) {
        const categoryName = category.name;
        const itemsInCategory = items.filter(
          (item) => item.category.toString() === category._id.toString()
        );
      
        const formattedItems = itemsInCategory.map((item) => ({
          id: item._id,
          name: item.name,
          weight: item.weight,
          calories: item.calories,
          category: item.category,
          description: item.description,
          price: item.price,          
        }));
      
        result.push({
          categoryId: category._id,
          categoryName: categoryName,
          items: formattedItems,
        });
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