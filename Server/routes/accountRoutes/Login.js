const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Account = require('../../models/accountModel');

router.post('/', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log('🔐 Login request:', { email, role });

        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '⚠️ Please enter email and password' 
            });
        }

        const account = await Account.findOne({ email: email.toLowerCase() }).select('+password');

        if (!account) {
            return res.status(401).json({ 
                success: false, 
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            });
        }

        const isMatch = await account.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
            });
        }

        if (role && account.role !== role) {
            return res.status(403).json({ 
                success: false, 
                message: `هذا الحساب مسجل كـ '${account.role}'` 
            });
        }

        const token = jwt.sign(
            { id: account._id, role: account.role },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '7d' }
        );

        console.log('✅ Login successful:', email);

        res.json({ 
            success: true, 
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                id: account._id,
                email: account.email,
                role: account.role
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في السيرفر',
            error: error.message 
        });
    }
});

module.exports = router;