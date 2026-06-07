const express = require('express');
const router = express.Router();
const DDS = require('../../models/DDS');

router.get('/', async (req, res) => {
  try {
    const allDDS = await DDS.find().select('-password');
    res.json(allDDS);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب DDS', error: error.message });
  }
});

module.exports = router;