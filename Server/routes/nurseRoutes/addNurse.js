const express = require('express');
const router = express.Router();
const Nurse = require('../../models/nurseModel');

// ✅ المسار: POST /api/nurse/add
router.post('/', async (req, res) => {
    try {
        const { userId, gmail, password, diplome, service, equipe } = req.body;

        console.log('📝 Received nurse data:', { gmail, diplome, service });

        if (!gmail || !password || !diplome || !service || !equipe) {
            return res.status(400).json({ 
                success: false, 
                message: '⚠️ Please fill in all required fields' 
            });
        }

        const existingNurse = await Nurse.findOne({ gmail: gmail.toLowerCase() });
        if (existingNurse) {
            return res.status(400).json({ 
                success: false, 
                message: 'هذا الإيميل مستخدم بالفعل' 
            });
        }

        const nurse = new Nurse({
            userId,
            gmail: gmail.toLowerCase(),
            password,
            diplome,
            service,
            equipe
        });

        await nurse.save();
        
        console.log('✅ Nurse added successfully:', nurse.gmail);
        
        res.status(201).json({ 
            success: true, 
            message: 'Nurse added successfully',
            nurse: {
                id: nurse._id,
                gmail: nurse.gmail,
                diplome: nurse.diplome
            }
        });
        
    } catch (error) {
        console.error('❌ Error adding nurse:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error',
            error: error.message 
        });
    }
});

module.exports = router;