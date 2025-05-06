const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const verifyToken = require('../middleware/verifyToken');

// Save a trip
router.post('/save', verifyToken, async (req, res) => {
  try {
    const trip = new Trip({ ...req.body, userId: req.user.userId });
    await trip.save();
    res.status(201).json({ message: 'Trip saved successfully' });
  } catch (err) {
    console.error("Trip save error:", err);
    res.status(500).json({ error: 'Failed to save trip' }); 
  }
});

// Get all saved trips for the logged-in user 
router.get('/mytrips', verifyToken, async (req, res) => {
  try   {
    const trips = await Trip.find({ userId: req.user.userId });
    res.status(200).json(trips);
  } catch (err) {
    console.error('Fetch trips error:', err);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

module.exports = router;
