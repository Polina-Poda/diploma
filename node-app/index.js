// index.js
const express = require('express');
const app = express();
const server = require('http').createServer(app)
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 4000;
const socketIO = require('socket.io');
const { Users } = require('./models/userModel');
const { MenuItem } = require("./models/foodModel");
const { Order} = require("./models/orderModel");
const { Workers } = require("./models/workerModel");
const router = require('./router');
mongoose.connect('mongodb+srv://aleksander:vfr4eszaq1@cluster0.jgxw19c.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// const setupSocketIO = require('./socket');
const io = require('socket.io')(server,
  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended : true }));
app.use(express.json())
const cors = require('cors');
app.options('*', cors());

// Enable CORS for all routes
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://vue-js-rest.onrender.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Use the router
app.use(router);

// Configure Socket.IO
// setupSocketIO(http);



  let rooms = [];
  io.on('connection', async (socket) => {
    console.log(`A user connected with socket id: ${socket.id}`);

    // Handle 'addUserToRoom' message
    socket.on('join', async (data) => {
      try {
        const email = data.email; // Assuming the payload contains the email
      const table = data.table; // Assuming the payload contains the table number
      const role = data.role; // Assuming the payload contains the role

      // Check if the user exists in the database

      if(role == 'client'){
        const user = await Users.findOne({ email });

      if (!user) {
        console.log(`User with email ${email} not found. Disconnecting.`);
        socket.emit('authenticationFailed', { message: 'User not found' });
        socket.disconnect(true);
        return;
      }
      let checkRoom = rooms.find(room => room.table === table);
      if(checkRoom){
        if(checkRoom.users === email){
          socket.emit('return', { message: `lol` })
          
          return;
        }else{
          socket.emit('busy', { message: `Table ${table} is busy` })
          console.log( `Table ${table} is busy` );
          return;
        }
      }
      
      // Add the user to a room (you can customize the room name as needed)
      
      socket.join(table);
      let room = {
        table: table,
        users: email,
        waiter: '',
        chef: '',
        orders: [],
        orderStatus: 'created',
        socektId: socket.id
      }
      
      rooms.push(room);

      socket.emit('tableJoined', { message: `Added to ${table}` })
      console.log( `Added to ${table}` );

      }else if(role == 'staff'){
        const user = await Workers.findOne({ email });

      if (!user) {
        console.log(`User with email ${email} not found. Disconnecting.`);
        socket.emit('authenticationFailed', { message: 'User not found' });
        socket.disconnect(true);
        return;
      }
      let checkRoom = rooms.find(room => room.table === table);
      if(checkRoom){
        if(checkRoom.waiter === email){
          socket.emit('returnStaff', { message: `lol` })
          
          return;
        }else{
          socket.emit('busyStaff', { message: `Table ${table} is busy` })
          console.log( `Table ${table} is busy` );
          return;
        }
      }
      
      // Add the user to a room (you can customize the room name as needed)
      
      socket.join(table);
      let room = {
        table: table,
        users: '',
        waiter: email,
        chef: '',
        orders: [],
        orderStatus: 'created',
        socektId: socket.id
      }
      
      rooms.push(room);

      socket.emit('tableJoinedStaff', { message: `Added to ${table}` })
      console.log( `Added to ${table}` );
      }

    
    } catch (error) {
      console.log('Error:', error);
      socket.emit('tableJoined', { message: `Error joining table: ${error.message}` });
    }
   
    });
    socket.on('isInRoom', async (data) => {
      try{
        const email = data.email; // Assuming the payload contains the email       
        let room = rooms.find(room => room.waiter === email);
        if(room){
          socket.emit('return', true)
        }else{
          socket.emit('return', false)
        }
        
        
      }catch(error){
        console.log(error);
      }
    })
    socket.on('getRoomInfo', async (data) => {
      try{
        const email = data.email; // Assuming the payload contains the email       
        let room = rooms.find(room => room.waiter === email);
        let result = {
          table: room.table,
          status: room.orderStatus,
          orders: [],
          users: room.users
        }
        if(room){
        for(let i = 0; i < room.orders.length; i++){
          let food = await MenuItem.findById({ _id: room.orders[i] });
          result.orders.push(food);
        }
      }
        socket.emit('roomInfo', result)
        
        
      }catch(error){
        console.log(error);
      }
    })
    socket.on('waiterJoin', async (data) => {
      try{
        const email = data.email; // Assuming the payload contains the email
        const table = data.table; // Assuming the payload contains the table number
        let room = rooms.find(room => room.table === table);
        if(room){
          room.waiter = email;
        }
        console.log(room);
        socket.emit('waiterJoined', { message: `Added to ${table}` })
        console.log( `Added to ${table}` )
      }catch(error){
        console.log(error);
      }
    })
    socket.on('addFood', async (data) => {
      try{
        const email = data.email; // Assuming the payload contains the email
        const table = data.table; // Assuming the payload contains the table number
        const foodId = data.foodId; // Assuming the payload contains the foodId
        console.log(email, table, foodId);
        let room = rooms.find(room => room.table === table);
        if(room){
          room.orders.push(foodId);         
        }
        console.log(room);
        socket.emit('foodAdded', { message: `Food added` })
        console.log( `Food added` )
      }catch(error){
        console.log(error);
      }
       

    })
    socket.on('removeFood', (data) => {
      try {
        const email = data.email; // Assuming the payload contains the email
        const table = data.table; // Assuming the payload contains the table number
        const foodId = data.foodId; // Assuming the payload contains the foodId
        console.log(email, table, foodId);
    
        // Find the room with the specified table number
        const room = rooms.find(room => room.table === table);
    
        if (room) {
          // Find the index of the foodId in the orders array
          const index = room.orders.indexOf(foodId);
    
          // Check if the foodId exists in the orders array before removing
          if (index !== -1) {
            room.orders.splice(index, 1);
            console.log('Food removed from orders:', room.orders);
    
            // Emit a success message to the client
            socket.emit('foodRemoved', { message: `Food removed` });
          } else {
            console.log('Food not found in orders array.');
            socket.emit('foodRemoved', { message: `Food not found in orders array` });
          }
        } else {
          console.log('Room not found for table:', table);
          socket.emit('foodRemoved', { message: `Room not found for table ${table}` });
        }
      } catch (error) {
        console.log('Error:', error);
        socket.emit('foodRemoved', { message: `Error removing food: ${error.message}` });
      }
    });
    
    socket.on('getOrder', async (data) => {
    
      try{
        const email = data.email; // Assuming the payload contains the email
        const table = data.table; // Assuming the payload contains the table number
        
        let room = rooms.find(room => room.table === table);
        let summary = 0;
        let newArray =[]
        let result 
        if(room){        
          for(let i = 0; i < room.orders.length; i++){
            let food = await MenuItem.findById({ _id: room.orders[i] });
             newArray.push(food);
          }
         
          
          
          
        }
        console.log(newArray);
        if(newArray){
          newArray.forEach((item) => {
            summary += item.price;
          });
        }else{
          summary = 0;
        }
        result = {
          orders: newArray,
          summary: summary,
          status: room.orderStatus

        }
        socket.emit('order', result )
          
      }catch(error){
        console.log(error);
      }

    })
    socket.on('paidOrder', async (data) => {
      try{        
        const table = data.table; // Assuming the payload contains the table number
        console.log(table);
        let room = rooms.find(room => room.table === table);
        if(room){
          // Close the room by removing it from the rooms array
          const index = rooms.indexOf(room);
          if (index !== -1) {
            rooms.splice(index, 1);
            console.log('Room closed:', room);
          }
        }
        console.log(room);
        socket.emit('returnPaid', { message: 'Order paid' });
        io.emit('orderPaid', { message: 'Order paid' });
        console.log(`Order paid`);
      }catch(error){
        console.log(error);
      }
    })
    socket.on('deleteOrder', async (data) => {
      try{        
        const table = data.table; // Assuming the payload contains the table number
        console.log(table);
        let room = rooms.find(room => room.table === table);
        if(room){
          // Close the room by removing it from the rooms array
          const index = rooms.indexOf(room);
          if (index !== -1) {
            rooms.splice(index, 1);
            console.log('Room closed:', room);
          }
        }
        console.log(room);        
        io.emit('orderDelete', { message: 'Order paid' });
        console.log(`Order paid`);
      }catch(error){
        console.log(error);
      }
    })
    socket.on('createOrder', async (data) => {
      try{        
        const table = data.table; // Assuming the payload contains the table number
        console.log( table);
        let room = rooms.find(room => room.table === table);
        if(room){
          room.orderStatus = 'ordered';
        }
        console.log(room);
        io.emit('orderCreated', { message: 'Order created' });
        console.log( `Order created` )
      }catch(error){
        console.log(error);
      }
    })
    socket.on('moveToKitchen', async (data) => {
      try{        
        const table = data.table; // Assuming the payload contains the table number
        console.log( table);
        let room = rooms.find(room => room.table === table);
        if(room){
          room.orderStatus = 'cooking';
        }
        console.log(room);
        io.emit('movedToKitchen', { message: 'Order moved to kitchen' });
        console.log( `Order moved to kitchen` )
      }catch(error){
        console.log(error);
      }
    })
    socket.on('getOrdered', async (data) => {
      try{        
        let orderedOrders = rooms.filter(room => room.orderStatus === 'ordered');
        var newArray = [];
        for(let i = 0; i < orderedOrders.length; i++){
          let order = orderedOrders[i];
          let result = {
            table: order.table,
            orders: [],
            waiter: order.waiter
          }
          for(let j = 0; j < order.orders.length; j++){
            let food = await MenuItem.findById({ _id: order.orders[j] });
            result.orders.push(food);
          }
          newArray.push(result);
        }
        socket.emit('orderedOrders', newArray);
      }catch(error){
        console.log(error);
      }
    })
    socket.on('getCooking', async (data) => {
      try{        
        let cookingOrders = rooms.filter(room => room.orderStatus === 'cooking');
        var newArray = [];
        for(let i = 0; i < cookingOrders.length; i++){
          let order = cookingOrders[i];
          let result = {
            table: order.table,
            chef: order.chef,
            orders: []
          }
          for(let j = 0; j < order.orders.length; j++){
            let food = await MenuItem.findById({ _id: order.orders[j] });
            result.orders.push(food);
          }
          newArray.push(result);
        }
        socket.emit('cookingOrders', newArray);
      }catch(error){
        console.log(error);
      }
    })
    socket.on('chefJoin', async (data) => {
      try{
        const email = data.email; // Assuming the payload contains the email
        const table = data.table; // Assuming the payload contains the table number
        let room = rooms.find(room => room.table === table);
        if(room){
          room.chef = email;
        }
        console.log(room);
        socket.emit('chefJoined', { message: `Added to ${table}` })
        console.log( `Added to ${table}` )
      }catch(error){
        console.log(error);
      }
    })
    socket.on('getChefInfo', async (data) => {
      try{
        const email = data.email; // Assuming the payload contains the email       
        let room = rooms.find(room => room.chef === email);
        let result = {
          table: room.table,
          status: room.orderStatus,
          chef: room.chef,
          orders: [],
          users: room.users
        }
        if(room){
        for(let i = 0; i < room.orders.length; i++){
          let food = await MenuItem.findById({ _id: room.orders[i] });
          result.orders.push(food);
        }
      }
        socket.emit('roomInfo', result)
        
        
      }catch(error){
        console.log(error);
      }
    })
    socket.on('isChefInRoom', async (data) => {
      try{
        const email = data.email; // Assuming the payload contains the email       
        let room = rooms.find(room => room.chef === email);
        if(room){
          socket.emit('return', true)
        }else{
          socket.emit('return', false)
        }
        
        
      }catch(error){
        console.log(error);
      }
    })
    socket.on('markAsReady', async (data) => {
      try{        
        const table = data.table; // Assuming the payload contains the table number
        console.log( table);
        let room = rooms.find(room => room.table === table);
        if(room){
          room.orderStatus = 'ready';
          let orderData = {
            items: [],
            price: 0,
            chef: room.chef,
            waiter: room.waiter,
            user: room.users
          }
          for(let i = 0; i < room.orders.length; i++){
            let food = await MenuItem.findById({ _id: room.orders[i] });
            orderData.items.push({
              idMenuItem: food._id,
              priceMenuItem: food.price,
              nameMenuItem: food.name
            });
            orderData.price += food.price;
            // Create a new Order document and save it to the database
        }
        const newOrder = new Order(orderData);
            await newOrder.save();

            room.chef = '';
            

          }            

        console.log(room);
        io.emit('markedAsReady', { message: 'Order marked as ready' });
        console.log( `Order marked as ready` )
      }catch(error){
        console.log(error);
      }
    })

    
    // Example: Broadcasting a message to all connected clients
    

    socket.on('disconnect', () => {
      try {
        // Find the room associated with the disconnected user's socket id
        let room = rooms.find(room => room.socektId === socket.id);
    
        if (room) {
          // Check if the room status is 'created'
          if (room.orderStatus === 'created') {
            // Remove the room from the rooms array
            const index = rooms.indexOf(room);
            if (index !== -1) {
              rooms.splice(index, 1);
              console.log(`Room closed due to user disconnecting:`, room);
            }
          }
        }
    
        console.log('A user disconnected');
      } catch (error) {
        console.log('Error:', error);
      }
    });
    
  });

server.listen(port, () => console.log(`Listening on port ${port}`));
