// Get DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const cityButtons = document.getElementById('cityButtons');

// Weather card elements
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const timestamp = document.getElementById('timestamp');

// Fetch weather data
async function getWeather(city) {
    try {
        errorMessage.classList.add('hidden');
        
        const response = await fetch(`/api/weather/${city}`);
        const data = await response.json();
        
        if (data.success) {
            displayWeather(data);
        } else {
            showError(data.message);
        }
    } catch (error) {
        showError('Failed to fetch weather data. Please try again.');
    }
}

// Display weather information
function displayWeather(data) {
    cityName.textContent = data.city;
    temperature.textContent = `${data.data.temp}°C`;
    condition.textContent = data.data.condition;
    weatherIcon.textContent = data.data.icon;
    humidity.textContent = `${data.data.humidity}%`;
    wind.textContent = `${data.data.wind} km/h`;
    timestamp.textContent = `Updated: ${new Date(data.timestamp).toLocaleString()}`;
    
    weatherCard.classList.remove('hidden');
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Load city buttons
async function loadCities() {
    try {
        const response = await fetch('/api/cities');
        const data = await response.json();
        
        if (data.success) {
            data.cities.forEach(city => {
                const button = document.createElement('button');
                button.className = 'city-btn';
                button.textContent = city.name;
                button.onclick = () => getWeather(city.value);
                cityButtons.appendChild(button);
            });
        }
    } catch (error) {
        console.error('Failed to load cities:', error);
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        cityInput.value = '';
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
            cityInput.value = '';
        }
    }
});

// Load cities on page load
loadCities();

// Load default city
getWeather('mumbai');
