const connectDB = require('../../database/db');
const Message = require("../../models/Message");
const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { senderId, receiverId, content, timestamp, isRead } = req.body;
    
    connectDB(); 

    try {
        const up = await Message.findByIdAndUpdate(
            id,
            {
                senderId: senderId,
                receiverId: receiverId,
                content: content,
                timestamp: timestamp,
                isRead: isRead
            }
        );
        
        if(!up) {
            return res.send('This message is not in the database');
        }
        
        res.send("Message information updated");
        
    } catch(error) {
        console.log(error.message);
        res.send("Error: " + error.message);
    }
});

module.exports = router;