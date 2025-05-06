const express = require('express');
const Trip = require('../models/Trip');
const authMiddleware = require('../middleware/authMiddleware'); // Make sure the path to your middleware is correct
const router = express.Router();

router.post('/save', authMiddleware, async (req, res) => {
    try {
        let trip = new Trip({ ...req.body, user: req.user.userId });

        trip.accommodations.forEach(accommodation => {
            if (accommodation.price === "Price: N/A" || isNaN(accommodation.price)) {
                accommodation.price = null;
            } else {
                accommodation.price = parseFloat(accommodation.price);
            }
        });

        await trip.save();
        res.status(201).json({ message: 'Trip saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save trip' });
    }
});

module.exports = router;