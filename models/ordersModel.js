const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    orderID: {
        type: String,
        required: true,
        unique: true
    },
    serviceID: {
        type: Number,
        required: true,
        min: [1, 'service Id should be greater than 1']
    },
    filesUri: {
        type: [String],  // Assuming this is an array of file URIs
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    callBeforePrint: {
        type: Boolean,
        required: true,
        enum: [true, false]
    },
    deliveryOption: {
        type: String,
        required: true,
        enum: ['self', '3rd-party']  // Add delivery options as per requirement
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

const Orders = mongoose.model('Orders', ordersSchema);

module.exports = Orders;
