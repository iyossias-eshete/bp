const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description : {
        type: String,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    terms: {
        type: 'String'
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);