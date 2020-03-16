const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", config.get('requestFromDomain'));
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', require('./routes/getData'));

const PORT = config.get('port') || 5000;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
  } catch (e) {
    // throw new Error(e);
    console.log('Server Error: ', e.message);
    process.exit(1);
  }
}

start();
