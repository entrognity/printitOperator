const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/ordersControllers');

// define routes and their corresponding controllers
router.get('/', ordersControllers.getAllOrders);
router.post('/', ordersControllers.createOrder)

module.exports = router;