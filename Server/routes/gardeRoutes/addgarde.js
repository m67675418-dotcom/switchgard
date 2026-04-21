//addgarde
const Garde = require('../../models/Garde');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');
router.post('/', async (req, res) => {
    const {id, owner, dateGarde, status, } = req.body;

    try {
     connectDB();
        await Garde.create({id: id, owner: owner, dateGarde: dateGarde, status: status });
        res.send("Garde added"); 
    } catch (error) {
         console.log(error.message);
    }
});

module.exports = router;