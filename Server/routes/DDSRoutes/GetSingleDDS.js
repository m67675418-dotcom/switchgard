const express = require('express');
const router = express.Router();
const DDS = require('../../models/DDS');

router.get('/:id', async (req, res) => {
  try {
    const dds = await DDS.findById(req.params.id).select('-password');
    if (!dds) return res.status(404).json({ message: 'DDS غير موجود' });
    res.json(dds);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب DDS', error: error.message });
  }
});

module.exports = router;