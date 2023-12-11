const socketIO = require('socket.io');
const { Users } = require('./models/userModel');
const { MenuItem } = require("./models/foodModel");

const setupSocketIO = (server) => {
  const io = socketIO(server);
  let rooms = [];
  io.on('connection', async (socket) => {
    console.log('A user connected');

    // Handle 'addUserToRoom' message
    socket.on('join', async (data) => {
      const email = data.email; // Assuming the payload contains the email
      const table = data.table; // Assuming the payload contains the table number
      // Check if the user exists in the database
      const user = await Users.findOne({ email });
      if (!user) {
        console.log(`User with email ${email} not found. Disconnecting.`);
        socket.emit('authenticationFailed', { message: 'User not found' });
        socket.disconnect(true);
        return;
      }
      let checkRoom = rooms.find(room => room.table === table);
      if(checkRoom){
        socket.emit('busy', { message: `Table ${table} is busy` })
        console.log( `Table ${table} is busy` );
        return;
  
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
    });
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
    socket.on('removeFood', async (data) => {
      try{
        const email = data.email; // Assuming the payload contains the email
        const table = data.table; // Assuming the payload contains the table number
        const foodId = data.foodId; // Assuming the payload contains the foodId
        console.log(email, table, foodId);
        let room = rooms.find(room => room.table === table);
        if(room){
          let index = room.orders.indexOf(foodId);
          room.orders.splice(index, 1);
        }
        console.log(room);
        socket.emit('foodRemoved', { message: `Food removed` })
        console.log( `Food removed` )
      }catch(error){
        console.log(error);
      }
       

    })
    socket.on('getOrder', async (data) => {
    
      try{
        const email = data.email; // Assuming the payload contains the email
        const table = data.table; // Assuming the payload contains the table number
        console.log(email, table);
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
          summary: summary          
        }
        socket.emit('order', result )
          
      }catch(error){
        console.log(error);
      }

    })

    // Example: Broadcasting a message to all connected clients
    

    socket.on('disconnect', () => {
      let room = rooms.find(room => room.socektId === socket.id);
      if(room){
        let index = rooms.indexOf(room);
        rooms.splice(index, 1);
      }
      console.log('A user disconnected');

    });
  });
};

module.exports = setupSocketIO;
