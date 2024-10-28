const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    operatorID: {
        type: String,
        required: true
    },
    orderID: {
        type: String,
        required: true,
        unique: true
    },
    articleIDs: {
        type: [String],
        required: true,
        unique: true
    },
    noOfServices: {
        type: Number,
        required: true
    },
    callBeforePrint: {
        type: String,
        required: true,
        enum: ["Yes", "No"]
    },
    deliveryOption: {
        type: String,
        required: true,
        enum: ['Self', '3rdParty']  // Add delivery options as per requirement
    },
    orderAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed']
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['requested','processing', 'completed', 'rejected'] 
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

const Orders = mongoose.model('Orders', OrdersSchema);



const OrderArticlesSchema = new mongoose.Schema({
    articleID: {
        type: String,
        required: true,
        unique: true
    },
    serviceID: {
        type: Number,
        required: true,
    },
    filesUri: {
        type: [String],  // Assuming this is an array of file URIs
        required: true
    },
    noOfPages: {
        type: Number,
        required: true
    },
    noOfCopies: {
        type: Number,
        required: true
    },
    printColor: {
        type: String,
        required: true,
        enum: ['BW', 'AllColor', 'BWandColorMix']
    },
    bwPageNos: {      // remove this, write logic (total - color)
        type: [Number]
    },
    colorPagesNos: {
        type: [Number]
    },
    printSides: {
        type: String,
        required: true,
        enum: ['SingleSide', 'BothSides']
    },
    note: {
        type: String,
        required: true
    },
    articleAmount: {
        type: Number,
        required: true
    }
}, {
    discriminatorKey: 'articleType',
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

const OrderArticles = mongoose.model('OrderArticles', OrderArticlesSchema);



module.exports = {
    Orders,
    OrderArticles
};
