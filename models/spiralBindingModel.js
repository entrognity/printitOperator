const mongoose = require('mongoose');

// SpiralBinding
const spiralBindingSchema = new mongoose.Schema({
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
    },
    coverColor: {
        type: String,
        required: true,
        enum: ['white', 'green', 'blue', 'purple', 'red', 'orange', 'yellow', 'black']
    }
});
const spiralBinding = mongoose.model('spiralBinding', spiralBindingSchema);

module.exports = spiralBinding;
