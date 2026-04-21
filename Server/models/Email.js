const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    html: {
        type: String
    },
    status: {
        type: String,
        enum: ['sent', 'failed'],
        default: 'sent'
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Email', emailSchema);