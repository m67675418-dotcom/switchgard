//deleteNurse
const Nurse = require('../../models/nurseModel');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

// supprision
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    connectDB();

    try {
        const del = await Nurse.findByIdAndDelete(id);
        res.send ("Nursedelete");
    } catch (error){
        console.log(error.message);
    }
});
module.exports = router; 