const express = require('express');
const router = express.Router();
const DDS = require('../../models/DDS');

router.put('/:id', async (req, res) => {
  try {
    const updatedDDS = await DDS.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!updatedDDS) return res.status(404).json({ message: 'DDS غير موجود' });
    res.json(updatedDDS);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في تحديث DDS', error: error.message });
  }
});

module.exports = router;