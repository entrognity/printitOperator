const axios = require('axios');  // Add axios for making HTTP requests
const { Operators } = require('../models/operatorModel');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

// render the signup page
exports.signup = async (req, res) => {
    try {
        res.render('auth/signup.ejs');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error rendering signup page" });
    }
};

// render the login page
exports.login = async (req, res) => {
    try {
        res.render('auth/login.ejs');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error rendering login page" });
    }
};

// render the forgot password page
exports.getForgotPassword = async (req, res) => {
    try {
        res.render('auth/forgotPassword.ejs');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error rendering Forgot Password page" });
    }
};

// render the reset password page
exports.getResetPassword = async (req, res) => {
    try {
        res.render('auth/resetPassword.ejs');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error rendering Reset Password page" });
    }
};


// sign up / create operator
exports.signupOperator = async (req, res) => {

    const operatorDetails = {
        operatorName: req.body.fullName,
        operatorEmail: req.body.email,
        operatorPassword: req.body.password,
        operatorMobNumber: req.body.phoneNumber1,
        operatorMobNumberSecondary: req.body.phoneNumber2,
        operatorShopName: req.body.shopName,
        operatorStreet1: req.body.street1,
        operatorStreet2: req.body.street2 || null, // Default to null if not provided
        operatorLandmark: req.body.landmark || null, // Default to null if not provided
        operatorCity: req.body.city,
        operatorState: req.body.state,
        operatorPincode: req.body.pincode,
        operatorGmapUrl: req.body.gmapUrl
    };

    try {

        // Server-side validation
        if (!operatorDetails.operatorEmail || !operatorDetails.operatorPassword || !operatorDetails.operatorName || !operatorDetails.operatorShopName) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        // Check if operator already exists
        const existingUser = await Operators.findOne({ operatorEmail: operatorDetails.operatorEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if operator phone number already exists
        const existingPhNumber = await Operators.findOne({ operatorMobNumber: operatorDetails.operatorMobNumber });
        if (existingPhNumber) {
            return res.status(400).json({ message: 'Phone Number already exists' });
        }

        // Generate verification token and add to operatorDetails
        const verificationToken = crypto.randomBytes(20).toString('hex');
        operatorDetails.verificationToken = verificationToken;

        // Create a new operator
        const newOperator = await Operators.create(operatorDetails);


        // Send verification email
        const senderIdentity = "securityDept";  // For example: 'support', 'info', etc.
        const recipients = operatorDetails.operatorEmail; // Recipient email address (string or array of strings)
        const subject = "Email Verification";
        const verificationLink = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyEmail/${verificationToken}`;
        const emailText = `Please verify your email by clicking the following link:\n\n
            ${verificationLink}\n\n
            If you did not request this, please ignore this email.\n`;
        const category = "VERIFICATION";  // Optional category, adjust as needed

        // Call sendEmail function
        await sendEmail(senderIdentity, recipients, subject, emailText, category);

        // res.status(200).json({ message: 'Signup successful, please verify your email.' });

        res.status(201).json({
            status: 'success',
            data: {
                operatorDetail: newOperator
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'failed',
            error: err,
            message: 'Error occurred during signup'
        });
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    const receivedToken = req.params.token;

    try {
        // Find the user by verification token
        const user = await Operators.findOne({ verificationToken: receivedToken });

        if (!user) {
            // return res.status(400).json({ message: 'Invalid or expired verification token' });
            const message = 'Invalid or expired verification token';
            const flag = 0;
            return res.render('auth/verification.ejs', { message, flag });
        }

        // Verify the user's email and remove the verification token
        // const updateResult = await Operators.updateOne(
        //     { verificationToken: verificationToken },
        //     {
        //         $set: { isVerified: true },
        //         $unset: { verificationToken: "" }  // Proper way to remove the field
        //     }
        // );

        // Verify the user's email
        user.isVerified = true;
        user.verificationToken = ""; // Clear the token
        await user.save();

        // if (updateResult.nModified === 0) {
        //     return res.status(404).json({ error: 'Error verifying the email' });
        // }

        // res.status(200).json({
        //     status: 'success',
        //     message: 'Email verified successfully'
        // });
        const message = 'Email verified successfully. You can Login now';
        const flag = 1;
        res.render('auth/verification.ejs', { message, flag })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'Error occurred during email verification',
            error: error
        });
    }
};


// Login 
exports.loginOperator = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the operator by email
        const operator = await Operators.findOne({ operatorEmail: email });

        if (!operator) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the operator's email is verified
        if (!operator.isVerified) {
            return res.status(403).json({ message: 'Email is not verified. Please verify your email before logging in.' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await operator.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token for the operator
        const token = jwt.sign(
            { operatorID: operator.operatorID, email: operator.operatorEmail },  // Payload with operator ID and email
            process.env.JWT_SECRET,                               // Secret key from .env
            { expiresIn: '30d' }                                   // Token expiration
        );

        // send the token in cookie
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            sameSite: 'Strict',
        };
        if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
        res.cookie('jwt', token, cookieOptions);

        // Respond with the token and operator details
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            token,    // JWT token
            operator: {
                id: operator.operatorID,
                email: operator.operatorEmail,
                // Include any other necessary operator fields
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: 'An error occurred during login',
            error: error.message
        });
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const operator = await Operators.findOne({ operatorEmail: email });
        if (!operator) {
            return res.status(404).json({ message: 'No account found with that email.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        operator.resetPasswordToken = resetToken;
        operator.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await operator.save();

        // Send email with reset link
        const senderIdentity = "securitydept";  // For example: 'support', 'info', etc.
        const recipients = operator.operatorEmail; // Recipient email address (string or array of strings)
        const subject = "Password Reset Request";
        const resetLink = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
        const emailText = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetLink}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`;
        const category = "RESET PASSWORD";  // Optional category, adjust as needed
        // Call sendEmail function
        await sendEmail(senderIdentity, recipients, subject, emailText, category);



        res.status(200).json({ message: 'Reset link sent to your email.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const operator = await Operators.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!operator) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Hash the new password before saving
        operator.operatorPassword = newPassword;
        operator.resetPasswordToken = undefined; // Clear reset token
        operator.resetPasswordExpires = undefined; // Clear expiration time

        await operator.save();
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and checking if it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({
                message: 'You are not logged in! Please log in to get access.'
            });
        }

        // 2) Verifying the token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        //   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await Operators.findOne({ operatorID: decoded.operatorID });
        if (!currentUser) {
            return res.status(401).json({
                message: 'The user no longer exists.'
            });
        }

        // 4) Check if the user changed the password after the token was issued
        // if (currentUser.changedPasswordAfter(decoded.iat)) {
        //     return res.status(401).json({
        //         message: 'User recently changed password! Please log in again.'
        //     });
        // }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (err) {
        next(err); // Pass the error to the global error handler
    }
};
