const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const port  = process.env.PORT || 4000;
const router = require('./router')


// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://aleksander:vfr4eszaq1@cluster0.jgxw19c.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Your routes and other middleware here

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

