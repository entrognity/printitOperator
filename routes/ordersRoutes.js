const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/ordersControllers');

// define routes and their corresponding controllers
router.get('/', ordersControllers.getOrders);
router.post('/', ordersControllers.createOrder);
router.get('/ordersTable', ordersControllers.getOrdersTable);
router.get('/:id', ordersControllers.getOrder);


// router
//   .route('/')
//   .get(ordersControllers.getAllOrders)
//   .post(ordersControllers.createOrder);

module.exports = router;