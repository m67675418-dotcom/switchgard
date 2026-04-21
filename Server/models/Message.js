// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: { type: String, ref: 'Message', required: true }, // الشخص الذي أرسل الرسالة
    receiverId: { type: String, required: true }, // الشخص7 الذي يستقبل الرسالة
    //receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true }, // الشخص7 الذي يستقبل الرسالة7
    content: { type: String, required: true }, // نص الرسالة
    timestamp: { type: Date, default: Date.now }, // وقت إرسال الرسالة
    isRead: { type: Boolean, default: false } // لمعرفة هل قرأ الطرف الآخر الرسالة أم لا
},
{ collection: "Message"}
);

module.exports = mongoose.model('Message', MessageSchema);