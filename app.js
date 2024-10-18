// import libraries and modules
const express = require('express');
const morgan = require('morgan');
const ordersRoutes = require('./routes/ordersRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const filesRoutes = require('./routes/filesRoutes');
const bodyParser = require('body-parser');


const app = express();

// middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));
app.set('view engine', 'ejs'); // Set view engine to EJS
app.set('views', `${__dirname}/views`); // Set the directory where EJS files are located

// Application routes
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/files', filesRoutes);


// exports
module.exports = app;