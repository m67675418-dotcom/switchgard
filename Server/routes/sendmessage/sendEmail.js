const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Email = require('../../models/Email'); 
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// POST endpoint to send email
router.post('/', async (req, res) => {
    const { to, subject, text, html } = req.body;

    const mailOptions = {
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    try {
        // ✅ بعث الإيميل
        await transporter.sendMail(mailOptions);
        
        // ✅ حفظ في MongoDB
        await Email.create({
            to,
            subject,
            text,
            html,
            status: 'sent'
        });

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        
        // ✅ حفظ الخطأ في MongoDB
        await Email.create({
            to,
            subject,
            text,
            html,
            status: 'failed'
        });
        
        res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
});

module.exports = router;