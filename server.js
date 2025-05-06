// server.js (Complete with all routes)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios'); // Add axios

dotenv.config();

const authRoutes = require('./routes/authroutes');
const travelRoutes = require('./routes/travelRoutes');
const tripRoutes = require('./routes/tripRoutes');


const app = express();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('Error: Missing required environment variables (MONGO_URI or JWT_SECRET)');
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/trips', tripRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

if (process.env.NODE_ENV === 'development') {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("MONGO_URI:", process.env.MONGO_URI);
}

app.use('/api/auth', authRoutes);
app.use('/api/travel', travelRoutes);

// New Routes for Nominatim, Wikipedia, ExchangeRate-API
app.get('/api/destinations/geocode', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
        );

        if (response.data.length > 0) {
            res.json({
                latitude: response.data[0].lat,
                longitude: response.data[0].lon,
                displayName: response.data[0].display_name,
            });
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    } catch (err) {
        console.error('Error geocoding:', err);
        res.status(500).json({ message: 'Error geocoding' });
    }
});

app.get('/api/destinations/wikipedia/:placeName', async (req, res) => {
    const { placeName } = req.params;

    try {
        const response = await axios.get(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${placeName}&origin=*`
        );

        const pages = response.data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId !== '-1') {
            res.json(pages[pageId]);
        } else {
            res.status(404).json({ message: 'Wikipedia page not found' });
        }
    } catch (err) {
        console.error('Error fetching Wikipedia data:', err);
        res.status(500).json({ message: 'Error fetching Wikipedia data' });
    }
});

app.get('/api/costs/convert', async (req, res) => {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
        return res.status(400).json({ message: 'From, to, and amount parameters are required' });
    }

    try {
        const response = await axios.get(
            `https://api.exchangerate-api.com/v4/latest/${from}`
        );

        const rate = response.data.rates[to];
        if (rate) {
            res.json({ convertedAmount: amount * rate });
        } else {
            res.status(404).json({ message: 'Currency conversion rate not found' });
        }
    } catch (err) {
        console.error('Error converting currency:', err);
        res.status(500).json({ message: 'Error converting currency' });
    }
});

app.get('/', (req, res) => {
    res.redirect('/userLogin.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));