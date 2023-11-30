const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const mongoose = require('mongoose');
const port  = process.env.PORT || 4000;
const router = require('./router')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended : true }));
app.use(express.json())

const cors = require('cors');
app.options('*', cors());

const corsOptions = {
  credentials: true,
   origin:'*',
};

app.use(cors(corsOptions));

app.use("/",cors(corsOptions),router)

const start = async () => {
    try {
      await mongoose.connect(`mongodb+srv://aleksander:vfr4eszaq1@cluster0.jgxw19c.mongodb.net/?retryWrites=true&w=majority`)
     
      server.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
      });
    } catch (e) {
      console.log(e)
    }
  }
  start();