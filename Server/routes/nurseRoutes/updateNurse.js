const connectDB = require('../../database/db');
const Nurse = require("../../models/nurseModel");
const express = require('express');
const router = express.Router();

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const {userId, diplome, service, equipe} = req.body;
    
    connectDB(); // خليتها كيف ما طلبتي

    try {
        const up = await Nurse.findByIdAndUpdate(
          id,  {
                userId: userId, 
                diplome: diplome, 
                service: service, 
                equipe: equipe
            }
        );
        
        if(!up) {
            return res.send('This nurse is not in the database'); 
        }
        
        res.send("Nurse information updated");
        
    } catch(error) {
        console.log(error.message);
        res.send("Error: " + error.message); // ⚠️ ضروري باش مايوقعش hang للـ request
    }
});

module.exports = router;