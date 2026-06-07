// routes/gardeRoutes/addgarde.js - ✅ Updated: saves ownerId and role
const express = require('express');
const router  = express.Router();
const Garde   = require('../../models/Garde');

// POST /api/garde/add
router.post('/', async (req, res) => {
  try {
    const { owner, ownerId, dateGarde, status, role } = req.body;

    if (!dateGarde) {
      return res.status(400).json({ message: 'dateGarde is required' });
    }

    const garde = new Garde({
      owner:     owner || '',
      ownerId:   ownerId || null,   // ✅ save the user's _id
      dateGarde: new Date(dateGarde),
      status:    status || 'Active',
      role:      role || 'doctor',  // ✅ save the role
    });

    const saved = await garde.save();
    res.status(201).json({ message: '✅ Garde added', garde: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;