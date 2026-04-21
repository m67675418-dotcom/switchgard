const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // ضروري للتشفير ديال الكود السري

// 1. استيراد جميع الـ Models لي عندك باش تقدر تختار فين تسجل
// ملاحضة: بما أن الملف داخل routes/accountRoutes، طريق الـ Models هو ../../models
const Doctor = require('../../models/DoctorModel');
const Nurse = require('../../models/nurseModel');
const Pharmacist = require('../../models/pharmacistModel');
const FireFighters = require('../../models/FireFighters');
const Garde = require("../../models/Garde");
const Message = require("../../models/Message");
const Transaction = require("../../models/Transaction");

// ==========================================================
// STEP 1: التحقق من "كود الدخول" (Account Code)
// ==========================================================
router.post('/validate-code', async (req, res) => {
    try {
        const { accountCode } = req.body;

        // هنا دير التحقق واش هاد الكود موجود عندك ولا لا
        // ممكن تدير بحث فـ database أو تقارنو بـ list لي عندك
        const validCodes = ['CLINIC01', 'HOSPITAL99', 'ADMIN_CODE']; 
        
        if (validCodes.includes(accountCode)) {
            res.json({ 
                success: true, 
                message: 'الكود صحيح، أكمل التسجيل',
                redirect: '/signup-page' // هنا الـ Client كيولي لصفحة التسجيل
            });
        } else {
            res.status(400).json({ success: false, message: 'الكود غير صالح' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================================
// STEP 2: إنشاء الحساب (حسب الـ Role المختار)
// ==========================================================
router.post('/create', async (req, res) => {
    try {
        const { name, password, email, role } = req.body; 
        // الـ Role هنا كيكون "Doctor" أو "Nurse" أو "Pharmacist"

        // 1. تشفير كلمة السر (مهم بزاف للأمان)
        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;

        // 2. اختيار الـ Model الصحيح باش نسجلو فيه
        switch (role.toLowerCase()) {
            case 'doctor':
                newUser = new Doctor({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    // زيد باقي الحقول لي ف DoctorModel
                });
                break;

            case 'nurse':
                newUser = new Nurse({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    // زيد باقي الحقول لي ف nurseModel
                });
                break;
                
            case 'pharmacist':
                newUser = new Pharmacist({
                    name: name,
                    email: email,
                    password: hashedPassword
                });
                break;

            default:
                return res.status(400).json({ success: false, message: 'نوع الحساب غير معروف' });
        }

        // 3. حفظ البيانات فـ MongoDB
        await newUser.save();

        res.json({ 
            success: true, 
            message: 'تم إنشاء الحساب بنجاح',
            role: role 
        });

    } catch (error) {
        console.error(error);
        // واش كان الخطأ هو ديجا الاسم موجود؟
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: 'هذا الاسم أو الإيميل مستخدم ديجا' });
        }
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء التسجيل' });
    }
});

module.exports = router;