const mongoose = require('mongoose');

const ChatStarterSchema = new mongoose.Schema({
    starterName: {
        type: String,
    },
    type: {
        type: String,
    },
    phrases: {
        type: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatStarter', ChatStarterSchema);