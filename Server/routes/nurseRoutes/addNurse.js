//addNurse
const Nurse = require('../../models/nurseModel');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

router.post('/', async (req, res) => {
    const {userId, diplome, service,  equipe} = req.body;
    try {
        connectDB();
        await Nurse.create({userId: userId, diplome: diplome, service: service, equipe:  equipe});
        res.send("Nurse added ");
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;