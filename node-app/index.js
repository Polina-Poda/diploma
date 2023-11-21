const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port  = process.env.PORT || 4000;
const router = require('./router')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)

const start = async () => {
    try {
      await mongoose.connect(`mongodb+srv://aleksander:vfr4eszaq1@cluster0.jgxw19c.mongodb.net/?retryWrites=true&w=majority`)
     
      app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
      });
    } catch (e) {
      console.log(e)
    }
  }
  start();