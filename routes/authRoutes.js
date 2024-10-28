const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

// define routes and their corresponding controllers
router.get('/signup', authControllers.signup);
router.post('/signup', authControllers.signupOperator);

router.get('/verifyEmail/:token', authControllers.verifyEmail);

router.get('/login', authControllers.login);
router.post('/login', authControllers.loginOperator);

router.get('/forgotPassword', authControllers.getForgotPassword);
router.post('/forgotPassword', authControllers.forgotPassword);

router.get('/resetPassword/:token', authControllers.getResetPassword);
router.post('/resetPassword/:token', authControllers.resetPassword);

// router
//     .route('/resetPassword/:token')
//     .get('/resetPassword/:token', authControllers.getResetPassword)
//     .post('/resetPassword/:token', authControllers.forgotPassword);

module.exports = router;