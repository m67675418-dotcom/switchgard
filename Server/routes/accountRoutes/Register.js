const express = require('express');
const router = express.Router();

// ✅ تأكد من مسارات الموديلات الصحيحة عندك
const Account = require('../../models/accountModel'); 
const Doctor = require('../../models/DoctorModel');
const Nurse = require('../../models/nurseModel');
const Pharmacist = require('../../models/pharmacistModel');
const FireFighter = require('../../models/FireFighters'); // تأكد من اسم الملف

router.post('/', async (req, res) => {
    try {
        const { email, password, role, ...otherData } = req.body;

        console.log('📝 بيانات التسجيل:', { email, role, otherData });

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'البيانات ناقصة' });
        }

        // 1. إنشاء حساب المستخدم الأساسي
        const newAccount = new Account({
            email: email.toLowerCase(),
            password, // سيتم تشفيره تلقائياً بواسطة الموديل
            role
        });

        await newAccount.save();
        console.log('✅ تم إنشاء الحساب:', newAccount._id);

        // 2. إنشاء البيانات الخاصة حسب الدور
        try {
            switch (role.toLowerCase()) {
                case 'pharmacist':
                    await new Pharmacist({
                        userId: newAccount._id,
                        gmail: email.toLowerCase(),
                        nomPharmacie: otherData.nomPharmacie,
                        adressePharmacie: otherData.adressePharmacie,
                        numAgrement: otherData.numAgrement,
                        password: password
                    }).save();
                    break;

                case 'firefighter':
                    await new FireFighter({
                        userId: newAccount._id,
                        gmail: email.toLowerCase(),
                        matricule: otherData.matricule,
                        grade: otherData.grade,
                        uniteIntervention: otherData.uniteIntervention,
                        password: password
                    }).save();
                    break;

                case 'doctor':
                    await new Doctor({
                        userId: newAccount._id,
                        email: email.toLowerCase(),
                        fullName: otherData.fullName,
                        specialty: otherData.specialty,
                        numOrdre: otherData.numOrdre,
                        location: otherData.location,
                        password: password
                    }).save();
                    break;

                case 'nurse':
                    await new Nurse({
                        userId: newAccount._id,
                        gmail: email.toLowerCase(),
                        diplome: otherData.diplome,
                        service: otherData.service,
                        equipe: otherData.equipe,
                        password: password
                    }).save();
                    break;
                
                default:
                    // إذا كان الدور غير معروف، نحذف الحساب الذي أنشأناه
                    await Account.findByIdAndDelete(newAccount._id);
                    return res.status(400).json({ message: 'دور غير مدعوم' });
            }
        } catch (modelError) {
            console.error('❌ خطأ في حفظ بيانات الدور:', modelError);
            // في حالة الفشل، نحذف الحساب الأساسي لعدم ترك بيانات معلقة
            await Account.findByIdAndDelete(newAccount._id);
            throw modelError;
        }

        res.status(201).json({ 
            message: 'تم التسجيل بنجاح!',
            success: true 
        });

    } catch (error) {
        console.error('❌ خطأ فادح في السيرفر:', error);
        res.status(500).json({ 
            message: 'خطأ في السيرفر', 
            error: error.message 
        });
    }
});

module.exports = router;