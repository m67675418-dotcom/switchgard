const express = require('express');
const router = express.Router();
const Nurse = require('../../models/nurseModel');
const connectDB = require('../../database/db');

// ✅ بدّل المسار هكا
router.get('/:id', async (req, res) => {
    try {
        await connectDB();
        const nurse = await Nurse.findOne({ id: req.params.id });
        
        if (!nurse) {
            return res.status(404).json({ message: 'Nurse not found' });
        }
        
        res.json(nurse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;