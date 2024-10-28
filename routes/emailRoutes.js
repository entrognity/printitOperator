const express = require('express');
const router = express.Router();
const emailControllers = require('../controllers/emailControllers');

// define routes and their corresponding controllers
router.get('/', emailControllers.sendCustomEmail);


// router
//   .route('/')
//   .get(ordersControllers.getAllOrders)
//   .post(ordersControllers.createOrder);

module.exports = router;