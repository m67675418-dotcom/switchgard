 //getDoctor
const express = require('express');
const router = express.Router();
const Doctor = require('../../models/DoctorModel');
const connectDB = require('../../database/db');


// المسار لإضافة طبيب جديد
router.get('/', async (req, res) => {
    connectDB();
    try {
        const docs = await Doctor.find();
        res.json(docs);
    } catch (err) {
        res.json({ error: err.message });
    }
});

module.exports = router;