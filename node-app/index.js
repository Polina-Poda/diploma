const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 4000;
const router = require('./router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://vue-js-rest.onrender.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Use the router
app.use(router);

const start = async () => {
  try {
    // Replace 'your_mongodb_connection_string' with your actual MongoDB connection string
    await mongoose.connect('mongodb+srv://aleksander:vfr4eszaq1@cluster0.jgxw19c.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();