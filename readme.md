public/registeration.html :
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
  <title>Document</title>
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
        <form id="login-form" method="POST" onsubmit="return handleLogin(event)">
          <h2>Login</h2>
          <div class="inputbox">
            <input type="email" name="email" placeholder="Email" required />
            <span class="icon"><i class='bx bxl-gmail'></i></span>
          </div>
          <div class="inputbox">
            <input type="password" name="password" placeholder="Password" required />
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
    async function handleLogin(event) {
    event.preventDefault(); 
    const email = document.querySelector('#login-form input[type="email"]').value;
    const password = document.querySelector('#login-form input[type="password"]').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('authToken', data.token);
        window.location.href = 'dashboard.html';  
    } else {
        alert(data.error || 'Login failed');
    }
}
  </script>
</body>
</html>

routes/authroutes.js:
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

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

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword });  
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
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

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password incorrect");
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
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
    email: { type: String, unique: true },
    password: String
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

app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));



