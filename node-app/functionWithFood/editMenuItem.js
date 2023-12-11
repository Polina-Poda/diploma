const { MenuItem } = require("../models/foodModel");
const { Users, Workers } = require("../models/workerModel");

async function editMenuItem(req, res) {
  try {
    const { itemId, name, weight, calories, price, description, email } = req.body;

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

    if (checkEmail.role !== "admin" && checkEmail.role !== "chef") {
      return res.status(400).json({
        status: "error",
        message: "You do not have permission",
      });
    }

    const existingItem = await MenuItem.findById(itemId);

    if (!existingItem) {
      return res.status(404).json({
        status: "error",
        message: "Food not found",
      });
    }

    const existingMenuItemByName = await MenuItem.findOne({
      name: name,
      _id: { $ne: itemId },
    });

    if (existingMenuItemByName) {
      return res.status(400).json({
        status: "error",
        message: "A dish with that name already exists",
      });
    }

    // Update data of the menu item
    if (name) existingItem.name = name;
    if (weight) existingItem.weight = weight;
    if (calories) existingItem.calories = calories;
    if (price) existingItem.price = price;
    if (description) existingItem.description = description;

    // Save the updated menu item
    await existingItem.save();

    // Update the name in the favorites array of all users
    await Users.updateMany(
      { "favorites.foodName": existingItem.name },
      { $set: { "favorites.$.foodName": name } }
    );

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
