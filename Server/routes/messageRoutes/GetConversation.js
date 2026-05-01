// 📁 routes/messageRoutes/GetConversation.js
const express = require('express');
const router = express.Router(); // ← هذا السطر هو اللي كان ناقص!
const Message = require('../../models/Message');
const { protect } = require('../../middleware/authMiddleware');

// 🔍 GET /api/message/conversation/:otherUserId
router.get('/conversation/:otherUserId', protect, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user._id.toString();

    // 1️⃣ جلب كل الرسائل بين المستخدمین
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    // 2️⃣ تعليم الرسائل كمقروءة
    await Message.updateMany(
      { 
        senderId: otherUserId, 
        receiverId: currentUserId, 
        isRead: false 
      },
      { isRead: true }
    );

    // 3️⃣ إرسال الرد
    res.json({ 
      success: true, 
      count: messages.length, 
      messages 
    });

  } catch (error) {
    console.error('❌ Error fetching conversation:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;