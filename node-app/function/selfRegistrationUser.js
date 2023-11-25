const { Users } = require("../models/userModel");

async function selfRegistrationUser(req, res) {
  try {
    const { userName, email, password } = req.body;
    if(!userName || !email || !password) return res.status(400).json({message: "Not all fields are filled"})

    const newUser = new User({
        userName: userName,
        email: email,
        password: password,
        });

      const savedNewUser = await newUser.save();

      console.log("User added:", savedNewUser);

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      status: "error",
      message: "Помилка реєстрації",
    });
  }
}

module.exports.selfRegistrationUser = selfRegistrationUser;
