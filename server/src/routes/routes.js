const express = require('express');
const app = express();

app.use(require('./file'));

module.exports = app;