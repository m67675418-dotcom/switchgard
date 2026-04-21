//deletetransaction
const Transaction = require('../../models/Transaction');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

// supprision
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    connectDB();

    try {
     const del = await Transaction.findByIdAndDelete(id);
       
        res.send ("Transactiondelete");
    } catch (error){
        console.log(error.message);
    }
});
module.exports = router; 