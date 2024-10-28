const express = require('express');
const router = express.Router();
const ordersControllers = require('../controllers/ordersControllers');
const authControllers = require('../controllers/authControllers');

// define routes and their corresponding controllers
router.get('/', ordersControllers.getOrders);
router.post('/', ordersControllers.createOrders);
router.post('/articles', ordersControllers.createArticles);
router.get('/ordersTable', ordersControllers.getOrdersTable);
router.put('/ordersTable/updateStatus', ordersControllers.updateStatus);
router.get('/orderDetail/:id', ordersControllers.getOrderDetailPopup);
router.get('/:id', ordersControllers.getOrder);


// router
//   .route('/')
//   .get(ordersControllers.getAllOrders)
//   .post(ordersControllers.createOrder);

module.exports = router;