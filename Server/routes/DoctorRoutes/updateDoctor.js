const connectDB = require('../../database/db');
const Doctor = require("../../models/DoctorModel");
const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { fullName, email, specialty, numOrdre, location, isAvailable } = req.body;
    
    connectDB(); // كما طلب البروف

    try {
        const up = await Doctor.findByIdAndUpdate(id, 
            {
                fullName: fullName,
                email: email,
                specialty: specialty,
                numOrdre: numOrdre,
                location: location,
                isAvailable: isAvailable
            }
        );
        
        if(!up) {
            return res.send('This doctor is not in the database');
        }
        
        res.send("Doctor information updated");
        
    } catch(error) {
        console.log(error.message);
        res.send("Error: " + error.message);
    }
});

module.exports = router;