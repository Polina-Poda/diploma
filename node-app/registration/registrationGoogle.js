const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const dotenv = require("dotenv");
const axios = require("axios");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
dotenv.config();
const { Users } = require("../models/userModel");

async function googleRegistration(req, res) {
  const { token } = req.body;
  try {
    console.log("Received token:", token);
    const payload = await client.getTokenInfo(token);
    console.log("Received payload:", payload);
    const profileInfo = await fetchUserProfile(token);
    console.log("Received profileInfo:", profileInfo);

    const email = await Users.findOne({ email: profileInfo.email });

    if (email) {
      console.log("login", profileInfo.email);
      const response = await login(profileInfo);
      return res.status(200).json(response);
    } else {
      console.log("register", profileInfo.email);
      const response = await registration(profileInfo);

      await Users.create({ 
        email: profileInfo.email,
        password: "",
        hashPassword: "",
        userName: profileInfo.name,
        role: "user",
        googleStatus: true,
        });
      return res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
}
async function fetchUserProfile(token) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user profile");
  }
}

async function login(profileInfo) {
  console.log("login", profileInfo);
  const token = jwt.sign(
    {
      FullName: profileInfo.name,
      Email: profileInfo.email,
      Role: "user",
    },
    process.env.LINK_TOKEN,
    { expiresIn: "72h" }
  );
  const response = { status: "success", token: token, email: profileInfo.email };
  return response
}

async function registration(profileInfo) {
  console.log("registration", profileInfo);
  const token = jwt.sign(
    {
      FullName: profileInfo.name,
      Email: profileInfo.email,
      Role: "user",
    },
    process.env.LINK_TOKEN,
    { expiresIn: "72h" }
  );
  const response = { status: "success", token: token, email: profileInfo.email };
  return response
}

module.exports.googleRegistration = googleRegistration;
