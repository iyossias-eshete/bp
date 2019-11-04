const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name must be provided."],
        match: [/^[a-zA-Z0-9]+$/, "Invalid entry"]
    },
    phoneNumber: {
        type: Number,
        required: true,
        index: true,
    },
    email : {
        type :String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);