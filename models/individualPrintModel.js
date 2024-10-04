const mongoose = require('mongoose');

// IndividualPrint 
const individualPrintSchema = new mongoose.Schema({
    serviceID: {
        type: Number,
        required: true
    },
    printColor: {
        type: String,
        required: true,
        enum: ['B/W', 'All-Colors']
    },
    printSides: {
        type: String,
        required: true,
        enum: ['one-side', 'two-sides']
    }
});
const individualPrint = mongoose.model('individualPrint', individualPrintSchema);

module.exports = individualPrint;

