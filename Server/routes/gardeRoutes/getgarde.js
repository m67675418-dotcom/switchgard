const express = require('express');
const router = express.Router();
const Garde = require('../../models/Garde');

// ✅ المسار: GET /api/garde/getAll
router.get('/', async (req, res) => {
    try {
        const gardes = await Garde.find();
        res.json(gardes);
    } catch (error) {
        console.error('❌ Error fetching gardes:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
});

module.exports = router;