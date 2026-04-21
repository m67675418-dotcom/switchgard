//getpharmacist
const express = require('express');
const router = express.Router();
const pharmacist = require('../../models/pharmacistModel');
const connectDB = require('../../database/db');


// المسار لإضافة طبيب جديد
router.get('/', async (req, res) => {
    connectDB();
    try {
        const docs = await pharmacist.find();
        res.json(docs);
    } catch (err) {
        res.json({ error: err.message });
    }
});

module.exports = router;