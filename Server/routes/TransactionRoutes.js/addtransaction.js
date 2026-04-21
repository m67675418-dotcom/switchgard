//addtransaction
const Transaction = require('../../models/Transaction');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');


router.post('/', async (req, res) => {
    const {gardeI, demanderId, status,} = req.body;
    
    try {
        connectDB();
        await Transaction.create({gardeI: gardeI, demanderId: demanderId, status: status });
        res.send("Transaction added");
    } catch (error) {
         console.log(error.message);
    }
});

module.exports = router;