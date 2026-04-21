//deletepharmasict
const pharmacist = require('../../models/pharmacistModel');
const express = require('express');
const router = express.Router();
const connectDB = require('../../database/db');

// supprision
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    connectDB();

    try {
      const del = await pharmacist.findByIdAndDelete(id);
      if(!del) {
           res.send ('This pharmacist is not in the database');
     } 
        res.send ("pharmacistdelete");
    } catch (error){
        console.log(error.message);
    }
});
module.exports = router; 