const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/ordersControllers');

// define routes and their corresponding controllers
router.get('/', ordersControllers.getOrders);
router.post('/', ordersControllers.createOrders);
router.get('/ordersTable', ordersControllers.getOrdersTable);
router.put('/ordersTable/updateStatus', ordersControllers.updateStatus);
router.get('/orderDetail/:id', ordersControllers.getOrderDetailPopup);
router.get('/:id', ordersControllers.getOrder);


// router
//   .route('/')
//   .get(ordersControllers.getAllOrders)
//   .post(ordersControllers.createOrder);

module.exports = router;