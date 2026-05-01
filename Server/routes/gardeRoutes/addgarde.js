const express = require('express');
const router = express.Router();
const Garde = require('../../models/Garde');

// ✅ المسار: POST /api/garde/add
router.post('/', async (req, res) => {
    try {
        const { id, owner, dateGarde, status } = req.body;

        console.log('📝 Received garde data:', { owner, dateGarde });

        if (!owner || !dateGarde) {
            return res.status(400).json({ 
                success: false, 
                message: '⚠️ Please fill in all required fields' 
            });
        }

        const garde = new Garde({
            id: id || `GARDE-${Date.now()}`,
            owner,
            dateGarde,
            status: status || 'disponible'
        });

        await garde.save();
        
        console.log('✅ Garde added successfully');
        
        res.status(201).json({ 
            success: true, 
            message: 'Garde added successfully',
            garde: {
                id: garde._id,
                gardeId: garde.id,
                owner: garde.owner
            }
        });

    } catch (error) {
        console.error('❌ Error adding garde:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
});

module.exports = router;