const connectDB = require('../../database/db');
const Garde = require("../../models/Garde");
const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { owner, dateGarde, status } = req.body;
    
    connectDB(); // كما طلب البروف

    try {
        const up = await Garde.findByIdAndUpdate(
           id,
            {
                owner: owner,
                dateGarde: dateGarde,
                status: status
            }
        );
        
        if(!up) {
            return res.send('This garde is not in the database');
        }
        
        res.send("Garde information updated");
        
    } catch(error) {
        console.log(error.message);
        res.send("Error: " + error.message);
    }
});

module.exports = router;