const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  destination: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  tripType: {
    type: String, // Can be e.g., "Adventure", "Relaxation", etc.
    required: true
  },
  numberOfTravelers: {
    type: Number,
    required: true
  },
  tripDates: {
    type: String, // You can store dates as a string or an array, depending on the format you want
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This is the reference to the User model
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
