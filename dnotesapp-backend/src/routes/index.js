const authRoutes = require('./authRoutes');
const noteRoutes = require('./noteRoutes');
const express = require('express');
const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/notes', noteRoutes)
module.exports = router;