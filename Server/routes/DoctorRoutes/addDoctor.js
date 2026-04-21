//addDoctor(doctorRoutes)
const Doctor = require('../../models/DoctorModel');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

// 1. مسار إضافة طبيب جديد (POST)
router.post('/', async (req, res) => {
    const {fullName, email, specialty, numOrdre, location , isAvailable} = req.body;
    connectDB();

    try {
        await Doctor.create ({fullName: fullName, email: email, specialty: specialty, numOrdre: numOrdre, location: location, isAvailable: isAvailable});
        res.send ("Doctoradded");
    } catch (error){
        console.log(error.message);
    }
});
module.exports = router; 