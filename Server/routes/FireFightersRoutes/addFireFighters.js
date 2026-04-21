//addfirefighter
const FireFighter = require('../../models/FireFighters');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

router.post('/', async (req, res) => {
    const {userId, matricule, grade,  uniteIntervention} = req.body;
    try {
        connectDB();
        await FireFighter.create({userId: userId, matricule: matricule, grade: grade, uniteIntervention: uniteIntervention});
        res.send("firefighterModel added");
    } catch (error) {
       console.log(error.message);}
});

module.exports = router;