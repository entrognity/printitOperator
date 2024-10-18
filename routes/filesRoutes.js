const express = require('express');
const router = express.Router();
const filesControllers = require('../controllers/filesControllers');

// define routes and their corresponding controllers
router.get('/getFiles/:id', filesControllers.getFiles);


module.exports = router;