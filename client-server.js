const config = require('config');
const path = require('path');

const express = require('express');
const app = express();
app.use('/', express.static(path.join(__dirname, 'client', 'src')));

const CLIENT_PORT = config.get('clientPort') || 3000;
app.listen(CLIENT_PORT, () => console.log(`Client server has been started on port ${CLIENT_PORT}...`));
