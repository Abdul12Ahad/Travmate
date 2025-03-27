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