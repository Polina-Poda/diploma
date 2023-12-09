const { MenuItem } = require("../models/foodModel");
const { Users } = require("../models/userModel");

async function getFavorites(req, res) {
    try {      
        const email  = req.params.email;

    const checkEmail = await Users.findOne({ email: email });
        if (!checkEmail) {
            return res
            .status(401)
            .json({ status: "error", message: "Email not found" });
        }
        
        const favorites = checkEmail.favorites;
        console.log("Favorites",favorites);
        var arrayOfFavorites = [];
        for (const favorite of favorites) {
            const favoriteName = favorite.foodName;
            const favoriteItem = await MenuItem.findOne({ name: favoriteName });
            arrayOfFavorites.push(favoriteItem);
        }

      
      return res.status(201).json({
        status: "success",
        data: arrayOfFavorites,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        status: "error",
        message: "Error getting menu",
      });
    }
  }

  module.exports.getFavorites = getFavorites;