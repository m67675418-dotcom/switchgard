//addpharmacist
const Pharmacist = require('../../models/pharmacistModel');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

router.post('/', async (req, res) => {
    const {userId, nomPharmacie, adressePharmacie, numAgrement, isNightShift} = req.body;
    connectDB();
    try {
        await Pharmacist.create({userId: userId, nomPharmacie: nomPharmacie, adressePharmacie: adressePharmacie, numAgrement: numAgrement, isNightShift: isNightShift});
        res.send("Pharmacist added");
    } catch (error) {
         console.log(error.message);
    }
});

module.exports = router;