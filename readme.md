public/register.html :
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="registeration.css" />
  <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
  <title>Register</title>
</head>
<body>
  <header class="header">
    <nav class="navigation">
      <a href="index.html">Home</a>
      <a href="#">Trips</a>
      <a href="#">Booking</a>
      <a href="#">Services</a>
      <a href="#">Rooms</a>
    </nav>
    <p class="mylogo">Tripout</p>
    <form action="#" class="search-bar">
      <input type="text" placeholder="Search" />
      <button type="submit"><i class='bx bx-search-alt'></i></button>
    </form>
  </header>
  <div class="container">
    <div class="content">
      <h2 class="tittle"><i class='bx bx-user-plus'></i> Register Account</h2>
      <div class="text">
        <h2>Join us now! <span><br />Register to start your journey...</span></h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit, necessitatibus?</p>
        <div class="socialmedia">
          <a href="#"><i class='bx bxl-linkedin'></i></a>
          <a href="#"><i class='bx bxl-facebook'></i></a>
          <a href="#"><i class='bx bxl-instagram'></i></a>
          <a href="#"><i class='bx bxl-whatsapp'></i></a>
        </div>
      </div>
    </div>
    <div class="box">
      <div class="register-box">
        <form id="register-form" method="POST" onsubmit="return handleRegister(event)">
          <h2>Register</h2>
          <div class="inputbox">
            <input id="FullName" type="text" placeholder="Full Name" required />
            <span class="icon"><i class='bx bx-user'></i></span>
          </div>
          <div class="inputbox">
            <input id="Email" type="email" placeholder="Email" required />
            <span class="icon"><i class='bx bxl-gmail'></i></span>
          </div>
          <div class="inputbox">
            <input id="Password" type="password" placeholder="Password" required />
            <span class="icon"><i class='bx bxs-lock-alt'></i></span>
          </div>
          <div class="inputbox">
            <input id="confirmpw" type="password" placeholder="Confirm Password" required />
            <span class="icon"><i class='bx bxs-lock-alt'></i></span>
          </div>
          <div class="btn">
            <button type="submit">Register</button>
          </div>
          <div class="login">
            <p>Already have an account? <a href="userLogin.html">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script>
    async function handleRegister(event) {
    event.preventDefault(); // Prevent the default form submission
    const fullName = document.getElementById('FullName').value;
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const confirmPassword = document.getElementById('confirmpw').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        window.location.href = 'dashboard.html';  
    } else {
        alert(data.error || 'An error occurred during registration'); 
    }
}

  </script>
</body>
</html>


public/userLogin.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="design.css" />
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
  <title>Login | TravMate</title>
</head>
<body>
  <header class="header">
    <nav class="navigation">
      <a href="#">Home</a>
      <a href="#">Trips</a>
      <a href="#">Booking</a>
      <a href="#">Services</a>
      <a href="#">Rooms</a>
    </nav>
    <p class="mylogo">Tripout</p>
    <form action="#" class="search-bar">
      <input type="text" placeholder="search" />
      <button type="submit"><i class='bx bx-search-alt'></i></button>
    </form>
  </header>

  <div class="container">
    <div class="content">
      <h2 class="tittle"><i class='bx bx-trip'></i>Plan My Trip</h2>
      <br />
      <div class="text">
        <h2>
          Welcome!<span><br />to our Website TravMate...</span>
        </h2>
        <br />
        <p>
          "Welcome to our travel hub, your gateway to unforgettable adventures! Whether you're seeking hidden gems or famous destinations, we provide curated guides and expert tips to help you plan your perfect journey. Explore vibrant cities, breathtaking landscapes, and get inspired for your next trip!"
        </p>
        <div class="socialmedia">
          <a href=""><i class='bx bxl-linkedin'></i></a>
          <a href=""><i class='bx bxl-facebook'></i></a>
          <a href=""><i class='bx bxl-instagram'></i></a>
          <a href=""><i class='bx bxl-whatsapp'></i></a>
        </div>
      </div>
    </div>

    <div class="box">
      <div class="signin">
        <form id="login-form" method="POST">
          <h2>Login</h2>
          <div class="inputbox">
            <input type="email" id="email" name="email" placeholder="Email" required />
            <span class="icon"><i class='bx bxl-gmail'></i></span>
          </div>
          <div class="inputbox">
            <input type="password" id="password" name="password" placeholder="Password" required />
            <span class="icon"><i class='bx bxs-lock-alt'></i></span>
          </div>
          <div class="forgetpassword">
            <a href="forgetpass.html">Forget password?</a>
          </div>
          <div class="btn">
            <button type="submit" class="redirect">Login</button>
          </div>
          <div class="register">
            <p>New User? <a href="register.html">Register now</a></p>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script>
    document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            // Store the JWT token in localStorage
            localStorage.setItem('token', data.token);
            console.log('Login successful:', data.token); // Debugging
            
            // Check if the token is stored correctly before redirecting
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                window.location.href = '/dashboard.html';  // Redirect to dashboard
            } else {
                alert('Token not stored properly.');
            }
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
});

  </script>

</body>
</html>



routes/authroutes.js:
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login user
// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate access token
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Generate refresh token (longer expiration)
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Save refresh token in DB (optional but recommended)
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ accessToken, refreshToken }); // Send both tokens
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Refresh access token using refresh token
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
});


// Forgot password
router.post('/forgot-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error during password reset:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user info (protected route)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ name: user.fullName, email: user.email });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;


routes/travelRoutes.js:
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/travel/suggestions
router.post('/suggestions', authMiddleware, async (req, res) => {
    const { destination, budget, startDate, endDate, travelers, tripType } = req.body;

    try {
        // For now, return mocked suggestions
        const suggestions = [
            {
                place: destination || "Bali",
                estimatedCost: `$${budget || 1000}`,
                highlights: ["Beaches", "Temples", "Local Markets"],
                accommodation: "Hotel, 3-star",
                transport: "Flight + Cab",
                activities: ["Snorkeling", "Cultural tours"]
            },
            {
                place: "Thailand",
                estimatedCost: `$${(budget || 1000) - 100}`,
                highlights: ["Nightlife", "Street food", "Islands"],
                accommodation: "Resort",
                transport: "Flight",
                activities: ["Island hopping", "Spa treatments"]
            }
        ];

        res.status(200).json({ suggestions });
    } catch (err) {
        console.error('Error generating suggestions:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;




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


models/User.js:
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


utils/.env:
MONGO_URI=mongodb+srv://AbdulAhad:ahad1204@cluster0.usj8q.mongodb.net/test
JWT_SECRET=ranahd
EMAIL=random@gmail.com
EMAIL_PASS=ran123

server.js:
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const travelRoutes = require('./routes/travelRoutes');

dotenv.config();

// Validate required environment variables
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('Error: Missing required environment variables (MONGO_URI or JWT_SECRET)');
    process.exit(1); // Exit the application
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/travel', travelRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => {
      console.error('MongoDB Connection Error:', err);
      process.exit(1); // Exit the application on connection failure
  });

// Log environment variables in development mode only
if (process.env.NODE_ENV === 'development') {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("MONGO_URI:", process.env.MONGO_URI);
}

app.use('/api/auth', authRoutes); // Note: Prefixed with '/api/auth'

app.listen(5000, () => console.log('Server running on port 5000'));


public/dashboard.html:
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Travel Dashboard</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f0f4f8;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: auto;
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333;
    }
    label {
      display: block;
      margin-top: 15px;
    }
    input, select {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #0077ff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #005fcc;
    }
    .results {
      margin-top: 30px;
    }
    .suggestion {
      padding: 15px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 id="welcomeMessage">Welcome!</h2>
    <button onclick="logout()">Logout</button>

    <h3>Plan Your Travel</h3>
    <form id="travelForm">
      <label>Destination:</label>
      <input type="text" name="destination" required />

      <label>Budget ($):</label>
      <input type="number" name="budget" required />

      <label>Start Date:</label>
      <input type="date" name="startDate" required />

      <label>End Date:</label>
      <input type="date" name="endDate" required />

      <label>Number of Travelers:</label>
      <input type="number" name="travelers" required />

      <label>Trip Type:</label>
      <select name="tripType" required>
        <option value="Adventure">Adventure</option>
        <option value="Relaxation">Relaxation</option>
        <option value="Honeymoon">Honeymoon</option>
        <option value="Cultural">Cultural</option>
      </select>

      <button type="submit">Get Suggestions</button>
    </form>

    <div class="results" id="results"></div>
  </div>

  <script>
    const token = localStorage.getItem('token');

    // Helper function to check if JWT token is expired
    function isTokenExpired(token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
      } catch (err) {
        return true;
      }
    }

    if (!token || isTokenExpired(token)) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/userLogin.html'; // fixed to correct login page
    }

    async function fetchUserInfo() {
      try {
        const res = await fetch('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        document.getElementById('welcomeMessage').innerText = `Welcome, ${data.name || 'Traveler'}!`;
      } catch (err) {
        console.error(err);
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/userLogin.html';
      }
    }

    fetchUserInfo();

    document.getElementById('travelForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/api/travel/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const result = await res.json();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (Array.isArray(result.suggestions)) {
          result.suggestions.forEach((sug) => {
            const div = document.createElement('div');
            div.className = 'suggestion';
            div.innerHTML = `
              <strong>Place:</strong> ${sug.place}<br>
              <strong>Estimated Cost:</strong> ${sug.estimatedCost}<br>
              <strong>Highlights:</strong> ${sug.highlights.join(', ')}<br>
              <strong>Accommodation:</strong> ${sug.accommodation}<br>
              <strong>Transport:</strong> ${sug.transport}<br>
              <strong>Activities:</strong> ${sug.activities.join(', ')}
            `;
            resultsDiv.appendChild(div);
          });
        } else {
          resultsDiv.innerHTML = '<p>No suggestions found.</p>';
        }
      } catch (err) {
        console.error(err);
        alert('Failed to fetch travel suggestions');
      }
    });

    function logout() {
      localStorage.removeItem('token');
      window.location.href = '/userLogin.html';
    }
  </script>
</body>
</html>

middleware/ authMiddleware:
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

middleware/protectRoute.js:
/const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from header

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next(); // Proceed to the next middleware or route
    } catch (err) {
        console.error('Invalid token', err);
        return res.status(401).json({ error: 'Session expired or invalid token' });
    }
};

module.exports = authMiddleware;

config/db.js:
// db.js
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