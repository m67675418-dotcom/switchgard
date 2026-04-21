//gettransaction
const express = require('express');
const router = express.Router();
const Transaction = require('../../models/Transaction');
const connectDB = require('../../database/db');


// المسار لإضافة طبيب جديد
router.get('/', async (req, res) => {
    connectDB();
    try {
        const docs = await Transaction.find();
        res.json(docs);
    } catch (err) {
        res.json({ error: err.message });
    }
});

module.exports = router;