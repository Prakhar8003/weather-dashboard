// Get DOM elements
const citiesGrid = document.getElementById('citiesGrid');
const loading = document.getElementById('loading');
const currentTimeEl = document.getElementById('currentTime');
const avgTempEl = document.getElementById('avgTemp');
const particlesContainer = document.getElementById('particles');

// Update time display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    currentTimeEl.textContent = timeString;
}

// Create animated particles
function createParticles() {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Fetch and display all cities weather
async function loadAllCitiesWeather() {
    try {
        const citiesResponse = await fetch('/api/cities');
        const citiesData = await citiesResponse.json();

        if (citiesData.success) {
            const weatherPromises = citiesData.cities.map(city => 
                fetch(`/api/weather/${city.value}`).then(res => res.json())
            );

            const weatherResults = await Promise.all(weatherPromises);
            
            loading.classList.add('hidden');

            // Calculate average temperature
            const temps = weatherResults
                .filter(data => data.success)
                .map(data => data.data.temp);
            const avgTemp = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
            avgTempEl.textContent = `${avgTemp}°C`;

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

// Create weather card with animations
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

// Initialize
createParticles();
updateTime();
setInterval(updateTime, 1000);
loadAllCitiesWeather();

// Auto-refresh every 5 minutes
setInterval(() => {
    citiesGrid.innerHTML = '';
    loadAllCitiesWeather();
}, 300000);