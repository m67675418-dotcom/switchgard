//getfirefighter
const express = require('express');
const router = express.Router();
const fireFighter = require('../../models/FireFighters');
const connectDB = require('../../database/db');


// المسار لإضافة 
router.get('/', async (req, res) => {
    connectDB();
    try {
        const docs = await fireFighter.find();
        res.json(docs);
    } catch (err) {
        res.json({ error: err.message });
    }
});

module.exports = router;