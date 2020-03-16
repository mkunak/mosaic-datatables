const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", config.get('requestFromDomain'));
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', require('./routes/getData'));

app.use('/', express.static(path.join(__dirname, 'client', 'src')));

app.get('*', (req, res) =>{
  res.sendFile(path.resolve(path.join(__dirname, 'client', 'src', 'index.html')));
});

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
