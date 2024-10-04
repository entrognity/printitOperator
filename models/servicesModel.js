const mongoose = require('mongoose');

// Services
const ServicesSchema = new mongoose.Schema({
    serviceID: {
        type: Number,
        required: true,
        min: [1, 'service Id should be greater than 1']
    },
    serviceName: {
        type: String,
        required: true
    },
    serviceDescription: {
        type: String,
        required: false
    }
});

const Services = mongoose.model('Services', ServicesSchema);



// services prices
const servicesPricesSchema = new mongoose.Schema({
    accountID: {
        type: String,
        required: true
    },
    individualBWPerPage: {
        type: Number,
        required: true
    },
    individualColorPerPage: {
        type: Number,
        required: true
    },
    spiralBinding: {
        type: Number,
        required: true
    }
});

const ServicesPrices = mongoose.model('ServicesPrices', servicesPricesSchema);



// services tracking
const servicesTrackingsSchema = new mongoose.Schema({
    accountID: {
        type: String,
        required: true
    },
    serviceID: {
        type: Number,
        required: true,
        min: [1, 'service Id should be greater than 1']
    },
    isOpted: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    isActive: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    }
}, {
    timestamps: true
});

const ServicesTrackings = mongoose.model('ServicesTrackings', servicesTrackingsSchema);



module.exports = {
    Services,
    ServicesPrices,
    ServicesTrackings
};