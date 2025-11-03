const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files - CORRECTED PATH
app.use(express.static(path.join(__dirname, '..', 'public')));

// Mock weather data
const weatherData = {
  'mumbai': { temp: 32, condition: 'Sunny', humidity: 65, wind: 12, icon: '☀️' },
  'delhi': { temp: 28, condition: 'Cloudy', humidity: 70, wind: 8, icon: '☁️' },
  'bangalore': { temp: 24, condition: 'Rainy', humidity: 85, wind: 15, icon: '🌧️' },
  'chennai': { temp: 34, condition: 'Hot', humidity: 60, wind: 10, icon: '🌡️' },
  'kolkata': { temp: 30, condition: 'Humid', humidity: 80, wind: 6, icon: '💨' },
  'hyderabad': { temp: 29, condition: 'Clear', humidity: 55, wind: 9, icon: '🌤️' },
  'pune': { temp: 26, condition: 'Pleasant', humidity: 50, wind: 11, icon: '😊' },
  'ahmedabad': { temp: 35, condition: 'Very Hot', humidity: 45, wind: 14, icon: '🔥' }
};

// API Routes
app.get('/api/weather/:city', (req, res) => {
  const city = req.params.city.toLowerCase();
  
  if (weatherData[city]) {
    res.json({
      success: true,
      city: city.charAt(0).toUpperCase() + city.slice(1),
      data: weatherData[city],
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'City not found'
    });
  }
});

// Get all cities
app.get('/api/cities', (req, res) => {
  const cities = Object.keys(weatherData).map(city => ({
    name: city.charAt(0).toUpperCase() + city.slice(1),
    value: city
  }));
  
  res.json({
    success: true,
    count: cities.length,
    cities: cities
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌍 Weather Dashboard running on port ${PORT}`);
  console.log(`📍 Access at http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '..', 'public')}`);
});