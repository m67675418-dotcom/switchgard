const connectDB = require('../../database/db');
const FireFighter = require("../../models/FireFighters");
const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { userId, matricule, grade, uniteIntervention } = req.body;
    
    connectDB(); 

    try {
        const up = await FireFighter.findByIdAndUpdate(id,
            {
                userId: userId,
                matricule: matricule,
                grade: grade,
                uniteIntervention: uniteIntervention
            }
        );
        
        if(!up) {
            return res.send('This firefighter is not in the database');
        }
        
        res.send("Firefighter information updated");
        
    } catch(error) {
        console.log(error.message);
        res.send("Error: " + error.message);
    }
});

module.exports = router;