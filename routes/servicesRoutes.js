const express = require('express');
const router = express.Router();
const servicesControllers = require('../controllers/servicesControllers');

// define routes and their corresponding controllers
router.get('/', servicesControllers.getServices);
router.get('/allServices', servicesControllers.allServices);

router.get('/addEditServices', servicesControllers.addEditServices);
router.post('/addEditServices/updatePrices', servicesControllers.updatePrices);


router.get('/activeDisableServices', servicesControllers.activeDisableServices);
router.put('/activeDisableServices/updateStatus', servicesControllers.updateStatus);
// router
//   .route('/activeDisableServices')
//   .get(servicesControllers.activeDisableServices)
//   .post();


module.exports = router;