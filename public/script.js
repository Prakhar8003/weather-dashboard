// Get DOM elements
const citiesGrid = document.getElementById('citiesGrid');
const loading = document.getElementById('loading');

// Fetch and display all cities weather
async function loadAllCitiesWeather() {
    try {
        // Get list of cities
        const citiesResponse = await fetch('/api/cities');
        const citiesData = await citiesResponse.json();

        if (citiesData.success) {
            // Fetch weather for all cities
            const weatherPromises = citiesData.cities.map(city => 
                fetch(`/api/weather/${city.value}`).then(res => res.json())
            );

            const weatherResults = await Promise.all(weatherPromises);

            // Hide loading
            loading.classList.add('hidden');

            // Display weather cards
            weatherResults.forEach(data => {
                if (data.success) {
                    createWeatherCard(data);
                }
            });
        }
    } catch (error) {
        console.error('Failed to load weather data:', error);
        loading.innerHTML = '<p>Failed to load weather data. Please refresh the page.</p>';
    }
}

// Create weather card
function createWeatherCard(data) {
    const card = document.createElement('div');
    card.className = 'weather-card';
    
    const updateTime = new Date(data.timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    card.innerHTML = `
        <div class="card-header">
            <h2 class="city-name">${data.city}</h2>
            <div class="weather-icon">${data.data.icon}</div>
        </div>
        
        <div class="temperature-section">
            <div class="temperature">${data.data.temp}°C</div>
            <div class="condition">${data.data.condition}</div>
        </div>
        
        <div class="weather-details">
            <div class="detail-box">
                <span class="detail-icon">💧</span>
                <span class="detail-label">Humidity</span>
                <span class="detail-value">${data.data.humidity}%</span>
            </div>
            <div class="detail-box">
                <span class="detail-icon">💨</span>
                <span class="detail-label">Wind Speed</span>
                <span class="detail-value">${data.data.wind} km/h</span>
            </div>
        </div>
        
        <div class="timestamp">Updated: ${updateTime}</div>
    `;

    citiesGrid.appendChild(card);
}

// Load weather data on page load
loadAllCitiesWeather();

// Optional: Auto-refresh every 5 minutes
setInterval(() => {
    citiesGrid.innerHTML = '';
    loadAllCitiesWeather();
}, 300000);