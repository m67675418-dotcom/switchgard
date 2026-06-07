const express = require('express');
const router = express.Router();
const DDS = require('../../models/DDS');

router.post('/', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    const existingDDS = await DDS.findOne({ email });
    if (existingDDS) return res.status(400).json({ message: 'الـ DDS موجود بالفعل' });

    const newDDS = new DDS({ email, password, fullName });
    await newDDS.save();

    res.status(201).json({ message: 'تم إنشاء DDS بنجاح', dds: newDDS });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء DDS', error: error.message });
  }
});

module.exports = router;