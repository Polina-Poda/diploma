const e = require("express");
const { MenuItem } = require("../models/foodModel");
const { Workers } = require("../models/workerModel");

async function editMenuItem(req, res) {
  try {
    const { itemId, name, weight, calories, price, description, email } =
      req.body; // Отримайте нові дані для страви з тіла запиту

    if (!itemId || !email) {  
      return res.status(400).json({
        status: "error",
        message: "ItemId and email must be filled",
      });
    }
    const checkEmail = await Workers.findOne({ email: email });
    if (!checkEmail) {
      return res.status(400).json({
        status: "error",
        message: "Email not found",
      });
    }
    if (checkEmail.role !== "admin" && checkEmail.role !== "cook") {
      return res.status(400).json({
        status: "error",
        message: "You do not have permission",
      });
    }
    // Знайдіть страву за ідентифікатором
    const existingItem = await MenuItem.findById(itemId);

    if (!existingItem) {
      return res.status(404).json({
        status: "error",
        message: `Food not found`,
      });
    }

    const existingMenuItemByName = await MenuItem.findOne({
      name: name,
      _id: { $ne: itemId }, // Виключає поточний ідентифікатор категорії
    });

    if (existingMenuItemByName) {
      return res.status(400).json({
        status: "error",
        message: "A dish with that name already exists",
      });
    }

    // Оновіть дані страви з новими даними, якщо вони були передані
    if (name) existingItem.name = name;
    if (weight) existingItem.weight = weight;
    if (calories) existingItem.calories = calories;
    if (price) existingItem.price = price;
    if (description) existingItem.description = description;

    // Збережіть оновлену страву
    await existingItem.save();

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error editing food",
    });
  }
}

module.exports.editMenuItem = editMenuItem;
