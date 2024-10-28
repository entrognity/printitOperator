const mongoose = require('mongoose');
const idGeneration = require('../utils/idGeneration');
const bcrypt = require('bcryptjs');

const operatorsSchema = new mongoose.Schema({
    operatorID: {
        type: String,
        unique: true
    },
    operatorName: {
        type: String,
        required: true
    },
    operatorEmail: {
        type: String,
        required: true,
        unique: true
    },
    operatorPassword: {
        type: String,
        required: true
    },
    isVerified: {  // Email verification flag
        type: Boolean, 
        default: false 
    }, 
    verificationToken: {  // Email verification token
        type: String
    }, 
    resetPasswordToken: {  // For forgot password functionality
        type: String
    }, 
    resetPasswordExpires: {
        type: Date
    },
    operatorMobNumber: {
        type: String,
        required: true,
        unique: [true, 'phone number already exists']
    },
    operatorMobNumberSecondary: {
        type: String,
        required: true,
        unique: [true, 'phone number already exists']
    },
    operatorShopName: {
        type: String,
        required: true
    },
    operatorStreet1: {
        type: String,
        required: true
    },
    operatorStreet2: {
        type: String,
    },
    operatorLandmark: {
        type: String
    },
    operatorCity: {
        type: String,
        required: true
    },
    operatorState: {
        type: String,
        required: true
    },
    operatorPincode: {
        type: String,
        required: true
    },
    operatorGmapUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Pre-save hook to automatically generate the operatorID before saving
operatorsSchema.pre('save', async function (next) {
    // Check if operatorID already exists, if not generate a new one
    if (!this.operatorID) {
        try {
            this.operatorID = await idGeneration.generateOperatorID(this.operatorShopName, this.operatorMobNumber);
        } catch (err) {
            return next(err); // Pass the error to Mongoose
        }
    }

    // Hash the passwords
    if (!this.isModified('operatorPassword')) return next();
    const salt = await bcrypt.genSalt(10);
    this.operatorPassword = await bcrypt.hash(this.operatorPassword, salt);

    next();
});

// Compare hashed password
operatorsSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.operatorPassword);
};

const Operators = mongoose.model('Operators', operatorsSchema);


// const operatorsAddressSchema = new mongoose.Schema({
//     operatorStreet1: {
//         type: String,
//         required: true
//     },
//     operatorStreet2: {
//         type: String,
//     },
//     operatorLandmark: {
//         type: String
//     },
//     operatorCity: {
//         type: String,
//         required: true
//     },
//     operatorState: {
//         type: String,
//         required: true
//     },
//     operatorPincode: {
//         type: String,
//         required: true
//     },
//     operatorGmapUrl: {
//         type: String,
//         required: true
//     }
// });

// const OperatorsAddress = mongoose.model('OperatorsAddress', operatorsAddressSchema);




module.exports = {
    Operators,
    // OperatorsAddress
};
