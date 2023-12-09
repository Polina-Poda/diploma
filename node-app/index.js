// index.js
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 4000;
const router = require('./router');
const setupSocketIO = require('./socket');

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

// Configure Socket.IO
setupSocketIO(http);

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://aleksander:vfr4eszaq1@cluster0.jgxw19c.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    http.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
