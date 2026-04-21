//deletdoctor
const Doctor = require('../../models/DoctorModel');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

// supprision
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    connectDB();

    try {
       const del = await Doctor.findByIdAndDelete(id);
       if(!del) {
           res.send ('This doctor is not in the database');
     } 
        res.send ("Doctordelete");
    } catch (error){
        console.log(error.message);
    }
});
module.exports = router; 