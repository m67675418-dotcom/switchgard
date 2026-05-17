const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Doctor     = require('../../models/DoctorModel');
const Nurse      = require('../../models/nurseModel');
const Pharmacist = require('../../models/pharmacistModel');
const FireFighter = require('../../models/FireFighters');
const Account    = require('../../models/accountModel');

router.post('/', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        console.log('🔐 [1] Login request:', { email, role });

        if (!email || !password || !role) {
            console.log('❌ [2] بيانات ناقصة');
            return res.status(400).json({
                success: false,
                message: '⚠️ يرجى ملء جميع الحقول واختيار الدور'
            });
        }

        // ✅ الـ admin يتعامل بشكل منفصل
        if (role.toLowerCase() === 'admin') {
            console.log('🔍 [3] Searching for admin account...');

            // نبحث في Account ونتحقق من الـ role مباشرة
            const adminUser = await Account.findOne({
                email: email.toLowerCase(),
                role: 'admin'           // ← هذا يمنع أي account غير admin من الدخول
            }).select('+password');

            if (!adminUser) {
                console.log('❌ [4] No admin found with this email');
                return res.status(401).json({
                    success: false,
                    message: '❌ هذا الحساب غير مسجل كـ admin'
                });
            }

            console.log('✅ [5] Admin found! ID:', adminUser._id);

            const adminMatch = await adminUser.comparePassword(password);
            console.log('🔑 [6] Password match:', adminMatch);

            if (!adminMatch) {
                console.log('❌ [7] Wrong password for admin');
                return res.status(401).json({
                    success: false,
                    message: '❌ كلمة المرور غير صحيحة'
                });
            }

            const adminToken = jwt.sign(
                { id: adminUser._id, role: 'admin' },
                process.env.JWT_SECRET || 'your_secret_key',
                { expiresIn: '7d' }
            );

            console.log('✅ [8] Admin login SUCCESS:', email);

            return res.json({
                success: true,
                message: 'تم تسجيل الدخول بنجاح',
                token: adminToken,
                user: {
                    id: adminUser._id,
                    email: adminUser.email,
                    role: 'admin'
                }
            });
        }

        // ✅ باقي الأدوار
        let Model;
        let emailField = 'email';

        switch (role.toLowerCase()) {
            case 'doctor':
                Model = Doctor;
                emailField = 'email';
                break;
            case 'nurse':
                Model = Nurse;
                emailField = 'gmail';
                break;
            case 'pharmacist':
                Model = Pharmacist;
                emailField = 'gmail';
                break;
            case 'firefighter':
                Model = FireFighter;
                emailField = 'gmail';
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: '⚠️ دور غير مدعوم'
                });
        }

        console.log(`🔍 [3] Searching in ${role} collection...`);

        const user = await Model.findOne({ [emailField]: email.toLowerCase() }).select('+password');

        if (!user) {
            console.log(`❌ [4] No ${role} found with email: ${email}`);
            return res.status(401).json({
                success: false,
                message: '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        console.log(`✅ [5] ${role} found! ID: ${user._id}`);

        const isMatch = await user.comparePassword(password);
        console.log('🔑 [6] Password match:', isMatch);

        if (!isMatch) {
            console.log('❌ [7] Password does NOT match');
            return res.status(401).json({
                success: false,
                message: '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: role.toLowerCase() },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '7d' }
        );

        console.log(`✅ [8] Login SUCCESS for ${role}: ${email}`);

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                id:    user._id,
                email: user[emailField],
                role:  role.toLowerCase(),
                ...(role === 'doctor'      && { fullName: user.fullName, specialty: user.specialty }),
                ...(role === 'nurse'       && { userId: user.userId, diplome: user.diplome, service: user.service, equipe: user.equipe }),
                ...(role === 'pharmacist'  && { nomPharmacie: user.nomPharmacie }),
                ...(role === 'firefighter' && { matricule: user.matricule, grade: user.grade })
            }
        });

    } catch (error) {
        console.error('❌ [ERR] Fatal error:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في السيرفر',
            error: error.message
        });
    }
});

module.exports = router;