const { Order } = require('../models/orderModel');
const { MenuItem } = require('../models/foodModel');

async function getAllOrders(req, res) {
  try {
    const email = req.params.email;

    const orders = await Order.find({ user: email }).exec();

    return res.status(200).json({ status: 'success', data: orders });

    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

module.exports.getAllOrders = getAllOrders;
