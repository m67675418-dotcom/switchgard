const connectDB = require('../../database/db');
const Transaction = require("../../models/Transaction");
const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { gardeId, demanderId, status } = req.body;
    
    connectDB(); // كما طلب البروف

    try {
        const up = await Transaction.findByIdAndUpdate(
            id,
            {
                gardeId: gardeId,
                demanderId: demanderId,
                status: status
            }
        );
        
        if(!up) {
            return res.send('This transaction is not in the database');
        }
        
        res.send("Transaction information updated");
        
    } catch(error) {
        console.log(error.message);
        res.send("Error: " + error.message);
    }
});

module.exports = router;