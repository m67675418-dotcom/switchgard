//addmessage
const Message = require('../../models/Message');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

router.post('/', async (req, res) => {
    const {senderId, receiverId, content, timestamp, isRead} = req.body;
    try {
        connectDB();
        await Message.create({senderId: senderId, receiverId: receiverId, content: content, timestamp: timestamp, isRead: isRead});
        res.send("Message sent");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;