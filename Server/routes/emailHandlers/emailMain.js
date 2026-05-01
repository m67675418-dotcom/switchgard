const express = require('express');
const router = express.Router();
const Email = require('../../models/email');

// ✅ المسار: POST /api/email/send
router.post('/', async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        console.log('📝 Sending email to:', to, 'Subject:', subject);

        if (!to || !subject || (!text && !html)) {
            return res.status(400).json({ 
                success: false, 
                error: '⚠️ Please provide to, subject, and content (text or html)' 
            });
        }

        // ✅ هنا يمكنكي تزيدي كود إرسال الإيميل الحقيقي (Nodemailer مثلاً)
        // للآن، غادي نحفظوه غير فـ الداتابيز

        const email = new Email({
            to,
            subject,
            text: text || '',
            html: html || '',
            status: 'sent',
            sentAt: new Date()
        });

        await email.save();
        
        console.log('✅ Email saved successfully');
        
        res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully',
            savedId: email._id
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error', 
            message: error.message 
        });
    }
});

module.exports = router;