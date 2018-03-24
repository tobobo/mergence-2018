const express = require('express');
const apiApp = require('./api/app');

const mainApp = express();
const port = process.env.PORT || 3000;

mainApp.use('/api', apiApp);
mainApp.use(express.static('build'));
mainApp.use('*', express.static('build/index.html'));

mainApp.listen(port, () => console.log('listening'));
