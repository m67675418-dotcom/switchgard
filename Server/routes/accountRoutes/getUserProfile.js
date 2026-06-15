// Server/routes/accountRoutes/getUserProfile.js
const express = require('express');
const router  = express.Router();
const Doctor     = require('../../models/DoctorModel');
const Nurse      = require('../../models/nurseModel');
const FireFighter = require('../../models/FireFighters');
const Pharmacist = require('../../models/pharmacistModel');

const MODELS = { doctor: Doctor, nurse: Nurse, firefighter: FireFighter, pharmacist: Pharmacist };

// GET /api/user/profile/:id?role=doctor|nurse|firefighter|pharmacist
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { role } = req.query;
  const Model = MODELS[role];
  if (!Model) return res.status(400).json({ message: 'Invalid role' });
  try {
    const user = await Model.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ ...user.toObject(), _role: role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
