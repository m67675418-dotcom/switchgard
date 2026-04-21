//deletfirefighter
const FireFightere = require('../../models/FireFighters');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

// supprision
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    connectDB();

    try {
        const del = await FireFightere.findByIdAndDelete(id);
        if(!del) {
           res.send ('This FireFightere is not in the database');
     } 
        res.send ("firefighteredelete");
    } catch (error){
        console.log(error.message);
    }
});
module.exports = router; 