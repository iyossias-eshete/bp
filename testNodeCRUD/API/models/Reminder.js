const mongoose = require('mongoose');
const reminderStatus = require('../utils/reminderStatus');

const ReminderSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description : {
        type: String,
    },
    remindAt : {
        type: Date
    },
    status : {
      type: typeof reminderStatus
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    terms: {
        type: 'String'
    }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', ReminderSchema);