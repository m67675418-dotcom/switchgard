const connectDB = require('../../database/db');
const Pharmacist = require("../../models/pharmacistModel");
const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { userId, nomPharmacie, adressePharmacie, numAgrement, isNightShift } = req.body;
    
    connectDB(); // كما طلب البروف

    try {
        const up = await Pharmacist.findByIdAndUpdate(
            id,
            {
                userId: userId,
                nomPharmacie: nomPharmacie,
                adressePharmacie: adressePharmacie,
                numAgrement: numAgrement,
                isNightShift: isNightShift
            }
        );
        
        if(!up) {
            return res.send('This pharmacist is not in the database');
        }
        
        res.send("Pharmacist information updated");
        
    } catch(error) {
        console.log(error.message);
        res.send("Error: " + error.message);
    }
});

module.exports = router;