const express = require('express');
const router = express.Router();
const DDS = require('../../models/DDS');

router.delete('/:id', async (req, res) => {
  try {
    const deletedDDS = await DDS.findByIdAndDelete(req.params.id);
    if (!deletedDDS) return res.status(404).json({ message: 'DDS غير موجود' });
    res.json({ message: 'تم حذف DDS بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في حذف DDS', error: error.message });
  }
});

module.exports = router;