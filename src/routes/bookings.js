const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookingsController');

// POST /api/bookings/reserve
router.post('/reserve', controller.reserve);

module.exports = router;
