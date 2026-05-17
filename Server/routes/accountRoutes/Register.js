const express = require('express');
const router = express.Router();
const Account = require('../../models/accountModel');
const Doctor = require('../../models/DoctorModel');
const Nurse = require('../../models/nurseModel');
const Pharmacist = require('../../models/pharmacistModel');
const FireFighter = require('../../models/FireFighters');

router.post('/', async (req, res) => {
    try {
        const { email, password, role, ...otherData } = req.body;

        console.log('📝 [1] بيانات التسجيل:', { email, role });

        // التحقق من البيانات
        if (!email || !password || !role) {
            console.log('❌ [2] بيانات ناقصة');
            return res.status(400).json({ 
                success: false, 
                message: '⚠️ يرجى ملء جميع الحقول المطلوبة' 
            });
        }

        // التحقق من أن الإيميل غير مستخدم
        console.log('🔍 [3] التحقق من الإيميل:', email.toLowerCase());
        const existingAccount = await Account.findOne({ email: email.toLowerCase() });
        
        if (existingAccount) {
            console.log('❌ [4] الإيميل مستخدم بالفعل');
            return res.status(409).json({ 
                success: false, 
                message: '⚠️ هذا الإيميل مستخدم بالفعل، جربي إيميل آخر' 
            });
        }

        // إنشاء الحساب
        console.log('✅ [5] إنشاء حساب جديد...');
        const newAccount = new Account({
            email: email.toLowerCase(),
            password,
            role
        });

        await newAccount.save();
        console.log('✅ [6] تم إنشاء الحساب:', newAccount._id);

        // إنشاء البيانات الخاصة حسب الدور
        try {
            let newRecord;
            
            switch (role.toLowerCase()) {
                case 'doctor':
                    newRecord = new Doctor({
                        userId: newAccount._id,
                        email: email.toLowerCase(),
                        fullName: otherData.fullName,
                        specialty: otherData.specialty,
                        numOrdre: otherData.numOrdre,
                        location: otherData.location,
                        password
                    });
                    break;

                case 'nurse':
                    newRecord = new Nurse({
                        userId: newAccount._id,
                        gmail: email.toLowerCase(),
                        diplome: otherData.diplome,
                        service: otherData.service,
                        equipe: otherData.equipe,
                        password
                    });
                    break;

                case 'pharmacist':
                    newRecord = new Pharmacist({
                        userId: newAccount._id,
                        gmail: email.toLowerCase(),
                        nomPharmacie: otherData.nomPharmacie,
                        adressePharmacie: otherData.adressePharmacie,
                        numAgrement: otherData.numAgrement,
                        password
                    });
                    break;

                case 'firefighter':
                    newRecord = new FireFighter({
                        userId: newAccount._id,
                        gmail: email.toLowerCase(),
                        matricule: otherData.matricule,
                        grade: otherData.grade,
                        uniteIntervention: otherData.uniteIntervention,
                        password
                    });
                    break;

                default:
                    await Account.findByIdAndDelete(newAccount._id);
                    return res.status(400).json({ 
                        success: false, 
                        message: '⚠️ دور غير صالح' 
                    });
            }

            if (newRecord) {
                await newRecord.save();
                console.log('✅ [7] تم حفظ بيانات الدور:', role);
            }

            console.log('✅ [8] التسجيل نجح!');
            res.status(201).json({ 
                success: true, 
                message: '✅ تم إنشاء الحساب بنجاح!',
                user: {
                    id: newAccount._id,
                    email: newAccount.email,
                    role: newAccount.role
                }
            });

        } catch (modelError) {
            console.error('❌ [9] خطأ في حفظ بيانات الدور:', modelError.message);
            // حذف الحساب في حالة الفشل
            await Account.findByIdAndDelete(newAccount._id);
            throw modelError;
        }

    } catch (error) {
        console.error('❌ [ERR] خطأ فادح في السيرفر:', error);
        console.error('❌ [ERR] التفاصيل:', error.message);
        console.error('❌ [ERR] Stack:', error.stack);
        
        res.status(500).json({ 
            success: false, 
            message: 'خطأ في السيرفر',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;