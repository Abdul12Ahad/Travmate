config/db.js:
// config/db.js
const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));
};

module.exports = connectDB;

controllers/authController.js:
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Registering a new user
const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const newUser = new User({ fullName, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log("User Found:", user); // Debugging log

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Entered Password:", password); 
        console.log("Stored Hashed Password:", user.password); 
        console.log("Password Match Status:", isMatch); 

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Email not found' });
        }

        const resetToken = 'dummy-token'; 

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://yourdomain.com/reset-password/${resetToken}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Error sending email' });
            }
            res.status(200).json({ message: 'Password reset link sent' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword
};

middleware/authMiddleware.js:
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use JWT_SECRET
    req.user = decoded; // { userId, name }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

middleware/protectRoute.js:
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token is invalid or expired' });
    }
};

module.exports = authMiddleware;


middleware/verifyToken.js:
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // FIXED HERE
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};


models/Destination.js:
const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String },
    region: { type: String },
    description: { type: String },
    image: { type: String }, // URL to image
    averageCostPerDay: { type: Number }, // Average cost per person per day
    popularActivities: [String],
    culturalHighlights: [String],
    latitude: { type: Number},
    longitude: { type: Number}
});

module.exports = mongoose.model('Destination', destinationSchema);


 Trip.js:
const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  name: String,
  address: String,
  price: Number,
  url: String
}, { _id: false });

const tripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  budget: { type: Number, required: true },
  currency: { type: String, required: true },
  tripType: { type: String, required: true }, // from "travelType" in frontend
  numberOfTravelers: { type: Number, required: true },
  tripDates: { type: String, required: true }, // could also use [Date]
  duration: { type: Number },
  costPerPerson: { type: Number },
  totalCost: { type: Number },
  accommodations: [accommodationSchema],
  transport: { type: Array, default: [] },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;


User.js:
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


module.exports = mongoose.model('User', UserSchema);

routes/authroutes.js:
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Helpers
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id, name: user.fullName }, process.env.ACCESS_TOKEN_SECRETT, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

// Register
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ fullName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ token: accessToken, refreshToken });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Refresh Token
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ token: accessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});

// Protected Route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

routes/travelRoutes.js:
const express = require('express');
const router = express.Router();

// Dummy suggestions for now
const travelData = {
  manali: [
    { name: 'Hadimba Temple', cost: 200 },
    { name: 'Solang Valley', cost: 800 },
    { name: 'Mall Road', cost: 100 }
  ],
  goa: [
    { name: 'Baga Beach', cost: 0 },
    { name: 'Fort Aguada', cost: 100 },
    { name: 'Cruise Ride', cost: 1500 }
  ]
};

// POST /api/suggestions
router.post('/suggestions', (req, res) => {
  const { destination, budget } = req.body;

  if (!destination || !budget) {
    return res.status(400).json({ error: 'Destination and budget are required' });
  }

  const city = destination.toLowerCase();
  const suggestions = travelData[city] || [];

  // Filter places based on budget
  const filtered = suggestions.filter(place => place.cost <= budget);

  res.json({ destination, budget, places: filtered });
});

module.exports = router;


routes/tripRoutes.js:
const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const verifyToken = require('../middleware/verifyToken');

// Save a trip
router.post('/save', verifyToken, async (req, res) => {
  try {
    const {
      destination,
      budget,
      currency,
      travelType,
      travelers,
      startDate,
      endDate,
      duration,
      costPerPerson,
      totalCost,
      accommodations,
      transport
    } = req.body;

    const trip = new Trip({
      destination,
      budget,
      currency,
      tripType: travelType,
      numberOfTravelers: travelers,
      tripDates: `${startDate} to ${endDate}`,
      duration,
      costPerPerson,
      totalCost,
      accommodations,
      transport,
      userId: req.user.userId
    });

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

.env:
MONGO_URI=mongodb+srv://AbdulAhad:ahad1204@cluster0.usj8q.mongodb.net/test
JWT_SECRET=myjwtsecret
ACCESS_TOKEN_SECRET=myjwtsecret
REFRESH_TOKEN_SECRET=myrefreshsecret
EXCHANGERATE_API_KEY=141f5628ba4f8caba1a1a272
OPENWEATHER_API_KEY=068ed11c25e5b28a02e5fc7d84c87712


public/review.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Review Trip</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    * {
      box-sizing: border-box;
      transition: all 0.3s ease-in-out;
    }

    body {
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(120deg, #00b894, #74b9ff);
      color: #333;
      padding: 40px 20px;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .container {
      max-width: 950px;
      background: rgba(255, 255, 255, 0.85);
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      animation: fadeIn 0.6s ease-in-out;
    }

    h2 {
      font-size: 32px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #2d3436;
    }

    .section {
      margin-bottom: 30px;
    }

    .section h3 {
      font-size: 24px;
      color: #0984e3;
      margin-bottom: 12px;
    }

    .trip-info p,
    .accommodation p {
      margin: 6px 0;
    }

    .accommodation {
      border: 1px solid #dcdde1;
      padding: 20px;
      border-radius: 16px;
      margin-bottom: 20px;
      background: #f1f2f6;
      box-shadow: 0 5px 12px rgba(0, 0, 0, 0.05);
      position: relative;
      transition: transform 0.2s ease;
    }

    .accommodation:hover {
      transform: translateY(-4px);
    }

    .remove-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
    }

    .confirm-btn {
      background: linear-gradient(135deg, #6c5ce7, #00cec9);
      color: white;
      border: none;
      padding: 16px;
      border-radius: 14px;
      font-size: 18px;
      cursor: pointer;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .confirm-btn:hover {
      background: linear-gradient(135deg, #00cec9, #6c5ce7);
      transform: scale(1.02);
    }

    a {
      text-decoration: none;
      color: #0984e3;
      font-weight: 500;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="container" id="container">
    <h2><i data-lucide="map"></i> Review Your Trip</h2>

    <div class="section">
      <h3>Trip Details</h3>
      <div class="trip-info" id="tripInfo"></div>
    </div>

    <div class="section">
      <h3>Selected Accommodations</h3>
      <div id="accommodationListContainer"></div>
    </div>

    <button class="confirm-btn" onclick="saveTrip()">
      <i data-lucide="check-circle"></i> Confirm & Save Trip
    </button>
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", () => {
      lucide.createIcons();

      const tripData = JSON.parse(localStorage.getItem("tripData"));
      if (!tripData) {
        document.body.innerHTML = "<p style='color:red;'>No trip data found. Please go back and plan your trip.</p>";
        return;
      }

      document.getElementById("tripInfo").innerHTML = `
        <p><strong>Destination:</strong> ${tripData.destination}</p>
        <p><strong>Budget:</strong> ${tripData.budget.toFixed(2)} ${tripData.currency}</p>
        <p><strong>Travel Class:</strong> ${tripData.travelClass}</p>
        <p><strong>Number of Travelers:</strong> ${tripData.numTravelers}</p>
        <p><strong>Trip Duration:</strong> ${tripData.duration} days</p>
        <p><strong>Trip Dates:</strong> ${new Date(tripData.startDate).toDateString()} - ${new Date(tripData.endDate).toDateString()}</p>
        <p><strong>Estimated Cost/Person:</strong> ${tripData.costPerPerson.toFixed(2)} ${tripData.currency}</p>
        <p><strong>Total Estimated Cost:</strong> ${tripData.totalCost.toFixed(2)} ${tripData.currency}</p>
      `;

      renderAccommodations();
    });

    function renderAccommodations() {
      const selectedAccommodations = JSON.parse(localStorage.getItem("selectedAccommodations") || "[]");
      const container = document.getElementById("accommodationListContainer");
      container.innerHTML = "";

      if (selectedAccommodations.length === 0) {
        container.innerHTML = "<p>No accommodations selected.</p>";
      } else {
        selectedAccommodations.forEach((acc, index) => {
          const div = document.createElement("div");
          div.classList.add("accommodation");
          div.innerHTML = `
            <p><strong>Name:</strong> ${acc.name}</p>
            <p><strong>Address:</strong> ${acc.address}</p>
            <p><strong>Price:</strong> ${acc.price}</p>
            <a href="${acc.url}" target="_blank">View Details</a>
            <button class="remove-btn" onclick="removeAccommodation(${index})">Remove</button>
          `;
          container.appendChild(div);
        });
      }

      lucide.createIcons();
    }

    function removeAccommodation(index) {
      let selectedAccommodations = JSON.parse(localStorage.getItem("selectedAccommodations") || "[]");
      selectedAccommodations.splice(index, 1);
      localStorage.setItem("selectedAccommodations", JSON.stringify(selectedAccommodations));
      renderAccommodations();
    }

    async function saveTrip() {
      const token = localStorage.getItem("token");
      const tripData = JSON.parse(localStorage.getItem("tripData"));
      const accommodations = JSON.parse(localStorage.getItem("selectedAccommodations") || "[]");

      if (!token) {
        alert("You must be logged in to save the trip.");
        return;
      }

      const body = {
        destination: tripData.destination,
        budget: tripData.budget,
        travelType: tripData.travelClass,
        travelers: tripData.numTravelers,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        accommodations,
        transport: []
      };

      try {
        const res = await fetch("/api/trips/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

        let data;
        try {
          data = await res.json();
        } catch (err) {
          console.error("Failed to parse JSON:", err);
          throw new Error("Server error. Please check backend logs.");
        }

        if (res.ok) {
          alert("Trip saved successfully!");
        } else {
          console.error("Save Trip Error:", data);
          alert("Failed to save trip: " + (data.error || "Unknown error"));
        }

      } catch (error) {
        console.error(error);
        alert("An error occurred while saving the trip.");
      }
    }
  </script>
</body>
</html>


public/dashboard.html:
<!-- FINAL DASHBOARD.HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Travel Planner Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"/>
  <style>
           * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    body {
      background: linear-gradient(to right, #89f7fe, #66a6ff);
      color: #333;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    body.dark-mode {
      background-color: #1e1e1e;
      color: white;
    }

    body.dark-mode .container {
      background: rgba(40, 40, 40, 0.95);
    }

    body.dark-mode input,
    body.dark-mode select {
      background-color: #2a2a2a;
      color: white;
      border-color: #444;
    }

    header.hero {
      background: url('bg2.jpg') no-repeat center center/cover;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
    }

    header.hero .overlay {
      background-color: rgba(0, 0, 0, 0.1);
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    header.hero h1 {
      font-size: 2.5rem;
      z-index: 2;
    }

    .container {
      max-width: 1000px;
      margin: 30px auto;
      padding: 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 30px;
    }

    .top-bar .actions {
      display: flex;
      gap: 10px;
    }

    .logout-btn,
    .saved-trips-btn {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      color: white;
      cursor: pointer;
    }

    .logout-btn {
      background-color: #ff6b6b;
    }

    .saved-trips-btn {
      background-color: #6c5ce7;
    }

    .dark-mode-toggle {
      background-color: #333;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
    }

    .form-section { margin-bottom: 40px; }
    .form-section form {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    input[type="text"], input[type="number"], select {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #ccc;
      flex: 1 1 45%;
    }

    button[type="submit"] {
      background: #0984e3;
      color: white;
      margin-left: 400px;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .section-title {
      margin-bottom: 10px;
      font-size: 1.5rem;
      border-bottom: 2px solid #ddd;
      padding-bottom: 5px;
    }

    .card-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .card {
      background: white;
      border-radius: 15px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      padding: 20px;
      transition: transform 0.3s ease;
    }

    .dark-mode .card {
      background-color: #2a2a2a;
      color: white;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card i {
      font-size: 2rem;
      margin-bottom: 10px;
      color: #0984e3;
    }

    .checkout-btn {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }

    .checkout-btn button {
      background-color: #00b894;
      padding: 12px 24px;
      font-size: 1rem;
      border: none;
      border-radius: 10px;
      color: white;
      cursor: pointer;
    }

    .saved-trips {
      margin-top: 50px;
    }

    .trip-actions {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    .trip-actions button {
      flex: 1;
      padding: 8px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .view-btn {
      background-color: #6c5ce7;
      color: white;
    }

    .delete-btn {
      background-color: #d63031;
      color: white;
    }  </style> 
</head>
<body>
  <header class="hero">
    <div class="overlay">
      <h1>Plan Your Next Adventure</h1>
    </div>
  </header>

  <div class="container">
    <div class="top-bar">
      <h2>Welcome, <span id="userName">Traveler</span></h2>
      <div class="actions">
        <button class="logout-btn" onclick="logout()">Logout</button>
        <button class="dark-mode-toggle" onclick="toggleDarkMode()">
          <i class="fas fa-moon"></i>
        </button>
      </div>
    </div>

    <div class="form-section">
      <h3 class="section-title">Start Planning</h3>
      <form id="travelForm">
        <input type="text" id="destinationInput" placeholder="Enter Destination" required />
        <div style="flex: 1 1 45%; display: flex; gap: 10px;">
          <input type="number" id="budget" placeholder="Enter Budget" required style="flex: 2;" />
          <select id="currencySelector" style="flex: 1;">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="AUD">AUD</option>
            <option value="CAD">CAD</option>
            <option value="JPY">JPY</option>
            <option value="INR">INR</option>
          </select>
        </div>
        
        <button type="submit">Get Suggestions</button>
      </form>
    </div>

    <div class="recommendations">
      <h3 class="section-title">Destination Info</h3>
      <div class="card-list" id="recommendationsList"></div>
    </div>

    <div class="checkout-btn">
      <button onclick="goToBudgetPage()">Check Out Budget</button>
    </div>
  </div>

<script>
  const destinationInput = document.getElementById("destinationInput");
  const budgetInput = document.getElementById("budget");
  const recommendationsList = document.getElementById("recommendationsList");
  const currencySelector = document.getElementById("currencySelector");

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = 'userLogin.html';
  }

  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  }

  function loadDarkMode() {
    const enabled = localStorage.getItem('darkMode') === 'true';
    if (enabled) document.body.classList.add('dark-mode');
  }

  loadDarkMode();

  function isTokenExpired(token) {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  }

  async function refreshAccessToken(refreshToken) {
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        return data.token;
      } else {
        throw new Error("Refresh failed");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
    }
  }

  async function fetchWikipediaSummary(placeName) {
    try {
      const response = await fetch(`/api/destinations/wikipedia/${placeName}`);
      const data = await response.json();
      return data.extract || "No summary available.";
    } catch (error) {
      return "Error fetching summary.";
    }
  }

  const currencyRates = {
    EUR: 0.85, GBP: 0.75, AUD: 1.35,
    CAD: 1.25, JPY: 135, INR: 82,
  };

  async function fetchCurrencyConversion(amount, currency) {
    return parseFloat(amount) * (currencyRates[currency] || 1);
  }

  function goToBudgetPage() {
    const destination = destinationInput.value;
    const budget = budgetInput.value;
    if (!destination || !budget) {
      alert("Please fill in destination and budget first.");
      return;
    }
    window.location.href = `budget.html?destination=${encodeURIComponent(destination)}&budget=${encodeURIComponent(budget)}&currency=${currencySelector.value}`;
  }

  async function submitTravelForm(event) {
    event.preventDefault();
    const place = destinationInput.value;
    const budget = budgetInput.value;
    const selectedCurrency = currencySelector.value;

    let token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (isTokenExpired(token)) {
      token = await refreshAccessToken(refreshToken);
      if (!token) return;
    }

    const summary = await fetchWikipediaSummary(place);
    const trimmedSummary = summary.split(" ").slice(0, 100).join(" ") + "...";
    const convertedBudget = await fetchCurrencyConversion(budget, selectedCurrency);

    recommendationsList.innerHTML = ` 
      <div class="card">
        <i class="fas fa-map-marked-alt"></i>
        <h4>${place}</h4>
        <p>${trimmedSummary}</p>
      </div>
      <div class="card">
        <i class="fas fa-money-bill-wave"></i>
        <h4>Estimated Budget</h4>
        <p>${convertedBudget.toFixed(2)} ${selectedCurrency}</p>
      </div>`;
  }

  document.getElementById("travelForm").addEventListener("submit", submitTravelForm);
</script>
</body>
</html>


public/budget.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Trip Budget Estimator</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    * {
      box-sizing: border-box;
      transition: all 0.3s ease-in-out;
    }

    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(to right, #74ebd5, #acb6e5);
      margin: 0;
      padding: 0;
      color: #333;
    }

    .container {
      max-width: 800px;
      margin: 50px auto;
      background: #fff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
    }

    .header h2 {
      font-size: 28px;
      margin: 0;
      color: #2d3436;
    }

    #tripSummary {
      background-color: #f1f2f6;
      padding: 15px;
      border-radius: 12px;
      margin-bottom: 25px;
      border-left: 5px solid #00cec9;
    }

    form label {
      font-weight: 600;
      margin-top: 15px;
      display: block;
    }

    input, select {
      width: 100%;
      padding: 12px;
      margin-top: 6px;
      margin-bottom: 15px;
      border-radius: 10px;
      border: 1px solid #dcdde1;
      font-size: 15px;
    }

    button {
      background: linear-gradient(45deg, #0984e3, #6c5ce7);
      color: white;
      padding: 14px;
      border: none;
      width: 100%;
      border-radius: 10px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 10px;
    }

    button:hover {
      background: linear-gradient(45deg, #6c5ce7, #0984e3);
    }

    .results {
      margin-top: 30px;
      padding: 20px;
      background: #dff9fb;
      border-radius: 12px;
      animation: fadeIn 0.6s ease-in-out;
    }

    .results p {
      font-size: 16px;
      margin: 8px 0;
    }

    .accommodation-list {
      margin-top: 20px;
    }

    .accommodation-item {
      background: #fefefe;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 15px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.05);
      position: relative;
    }

    .accommodation-item input[type="checkbox"] {
      position: absolute;
      bottom: 10px;
      right: 10px;
      transform: scale(1.2);
    }

    .accommodation-item a {
      color: #0984e3;
      text-decoration: none;
    }

    .continue-btn {
      margin-top: 20px;
    }

    @media (max-width: 600px) {
      .container {
        padding: 20px;
      }

      h2 {
        font-size: 22px;
      }
    }

    @keyframes fadeIn {
      from {opacity: 0;}
      to {opacity: 1;}
    }

    .date-picker-container {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }

    .date-picker-container div {
      width: 48%;
    }

    .date-picker-container label {
      display: block;
      margin-bottom: 6px;
    }

    .date-picker-container input {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #dcdde1;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2><i data-lucide="wallet"></i> Trip Budget Estimator</h2>
    </div>

    <div id="tripSummary"></div>

    <form id="budgetForm">
      <label for="travelClass">Travel Class:</label>
      <select id="travelClass">
        <option value="economy">Economy</option>
        <option value="business">Business</option>
        <option value="firstClass">First Class</option>
      </select>

      <label for="numTravelers">Number of Travelers:</label>
      <input type="number" id="numTravelers" min="1" value="1" required />

      <div class="date-picker-container">
        <div>
          <label for="startDate">Trip Start Date:</label>
          <input type="date" id="startDate" required />
        </div>
        <div>
          <label for="endDate">Trip End Date:</label>
          <input type="date" id="endDate" required />
        </div>
      </div>

      <button type="submit"><i data-lucide="calculator"></i> Estimate Budget</button>
    </form>

    <div class="results" id="resultsBox" style="display:none;">
      <h3><i data-lucide="file-text"></i> Estimated Results</h3>
      <p><strong>Duration:</strong> <span id="tripDuration"></span> days</p>
      <p><strong>Estimated Cost/Person:</strong> <span id="costPerPerson"></span></p>
      <p><strong>Total Cost:</strong> <span id="totalCost"></span></p>

      <div class="accommodation-list" id="accommodationList"></div>
      <button class="continue-btn" onclick="goToReviewPage()">Continue to Review</button>
    </div>
  </div>

  <script>
    lucide.createIcons();

    function getQueryParams() {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        destination: urlParams.get("destination") || "",
        budget: parseFloat(urlParams.get("budget")) || 0,
        currency: urlParams.get("currency") || "USD",
      };
    }

    const { destination, budget, currency } = getQueryParams();

    if (!destination || isNaN(budget)) {
      alert("Missing destination or budget info. Please go back and fill the details.");
    }

    const summaryDiv = document.getElementById("tripSummary");
    summaryDiv.innerHTML = `
      <p><strong>Destination:</strong> ${destination}</p>
      <p><strong>Budget:</strong> ${budget.toFixed(2)} ${currency}</p>
    `;

    document.getElementById("budgetForm").addEventListener("submit", function(e) {
      e.preventDefault();

      const travelClass = document.getElementById("travelClass").value;
      const numTravelers = parseInt(document.getElementById("numTravelers").value);
      const start = new Date(document.getElementById("startDate").value);
      const end = new Date(document.getElementById("endDate").value);

      if (end < start) {
        alert("End date must be after start date.");
        return;
      }

      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      let multiplier = travelClass === "economy" ? 1 : travelClass === "business" ? 2 : 3;

      const costPerPerson = (budget * multiplier) / numTravelers;
      const totalCost = costPerPerson * numTravelers;

      document.getElementById("tripDuration").textContent = days;
      document.getElementById("costPerPerson").textContent = `${costPerPerson.toFixed(2)} ${currency}`;
      document.getElementById("totalCost").textContent = `${totalCost.toFixed(2)} ${currency}`;
      document.getElementById("resultsBox").style.display = "block";

      localStorage.setItem("tripData", JSON.stringify({
        destination,
        budget,
        currency,
        travelClass,
        numTravelers,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        duration: days,
        costPerPerson,
        totalCost
      }));

      fetchAccommodation(destination);
    });

    function fetchAccommodation(destination) {
      const apiKey = "dce1299f9amsh09095894c79a6b4p1f21b6jsnfbcf74056ea9";
      const url = `https://travel-advisor.p.rapidapi.com/locations/search?query=${encodeURIComponent(destination)}&limit=10&offset=0&units=km&currency=${currency}&sort=relevance&lang=en_US`;

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
      };

      fetch(url, options)
        .then(response => response.json())
        .then(data => {
          const accommodationList = document.getElementById("accommodationList");
          accommodationList.innerHTML = "";

          if (data?.data?.length > 0) {
            data.data.forEach((item, index) => {
              const acc = item.result_object || item;
              const name = acc.name || "No name available";
              const address = acc.address || "No address available";
              const price = acc.price || "N/A";
              const detailsUrl = acc.web_url || "#";

              accommodationList.innerHTML += `
                <div class="accommodation-item">
                  <input type="checkbox" id="accommodation-${index}" class="accommodation-checkbox" />
                  <a href="${detailsUrl}" target="_blank"><h4>${name}</h4></a>
                  <p>${address}</p>
                  <p><strong>Price:</strong> ${price}</p>
                </div>
              `;
            });
          }
        })
        .catch(error => console.error('Error fetching accommodation data:', error));
    }

    function goToReviewPage() {
      const selected = [];
      document.querySelectorAll(".accommodation-checkbox:checked").forEach(checkbox => {
        const parent = checkbox.closest(".accommodation-item");
        const name = parent.querySelector("h4")?.textContent || "";
        const address = parent.querySelector("p:nth-of-type(1)")?.textContent || "";
        const price = parent.querySelector("p:nth-of-type(2)")?.textContent || "";
        selected.push({ name, address, price });
      });

      localStorage.setItem("selectedAccommodations", JSON.stringify(selected));
      window.location.href = "review.html";
    }
  </script>
</body>
</html>


these are all the codes just fix the issue of the trips that arent saving in the database showing an error as invalid token 