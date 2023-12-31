const { Category, MenuItem } = require("../models/foodModel");
const { Users } = require("../models/userModel");
const { Workers } = require("../models/workerModel");

async function deleteCategoryAndItems(req, res) {
  try {
    const { categoryId, email } = req.body;

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

    // Перевірте, чи існує категорія з вказаною назвою
    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(400).json({
        status: "error",
        message: "Category not found",
      });
    }

    // Знайдіть всі страви, які належать до цієї категорії
    const itemsInCategory = await MenuItem.find({ category: categoryId });

    // Remove foods from users' favorites
    for (const item of itemsInCategory) {
      await Users.updateMany(
        { "favorites.foodName": item.name },
        { $pull: { favorites: { foodName: item.name } } }
      );
    }

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
      message: "Error deleting category and items",
    });
  }
}

module.exports.deleteCategoryAndItems = deleteCategoryAndItems;
