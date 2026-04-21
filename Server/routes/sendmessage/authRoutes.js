const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

router.get('/google', authController.getAuthUrl);
router.get('/google/callback', authController.handleCallback);
router.get('/gmail/profile', authController.getUserInfo);

module.exports = router;