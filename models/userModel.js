const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    userMobNumber: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

const Users = mongoose.model('Users', usersSchema);


const usersAddressSchema = new mongoose.Schema({
    userMobNumber: {
        type: String,
        required: true,
        unique: true
    },
    userStreet: {
        type: String,
        required: true
    },
    userLandmark: {
        type: String
    },
    userCity: {
        type: String,
        required: true
    },
    userState: {
        type: String,
        required: true
    },
    userPincode: {
        type: String,
        required: true
    },
    userGmapUrl: {
        type: String,
        required: true
    }
});

const UsersAddress = mongoose.model('UsersAddress', usersAddressSchema);

module.exports = {
    Users,
    UsersAddress
};
