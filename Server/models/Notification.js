// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId:        { type: String, required: true },
  type: {
    type: String,
    enum: [
      'demande_received',
      'demande_accepted',
      'demande_rejected',
      'director_review',
      'final_approved',
      'final_rejected',
      'chat_message',
    ],
    required: true,
  },
  message:       { type: String, required: true },
  demandeId:     { type: String, default: null },
  read:          { type: Boolean, default: false },
  otherUserId:   { type: String, default: null },
  otherUserName: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
