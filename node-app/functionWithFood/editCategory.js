const { Category } = require("../models/foodModel");
const { Workers } = require("../models/workerModel");
async function editCategory(req, res) {
  try {
    const { categoryId, name, email } = req.body; // Отримайте ідентифікатор страви з запиту

    if (!categoryId || !name || !email) {
      return res.status(400).json({
        status: "error",
        message: "All fields must be filled",
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
    // Знайдіть страву за ідентифікатором
    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({
        status: "error",
        message: `Category not found`,
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
        message: "Category with that name already exists",
      });
    }

    existingCategory.name = name;

    await existingCategory.save();

    return res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Error editing category",
    });
  }
}

module.exports.editCategory = editCategory;
