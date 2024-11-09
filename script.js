const apiKey = '3566fb776721a641b821697d8b496631';

// Function to get weather data
async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Could not retrieve data. Please check the city name.');
    }
}

// Function to get forecast data
async function getForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

// Function to render current weather
function renderWeather(data) {
    if (data) {
        document.getElementById('current-temp').innerText = `${data.main.temp}°C`;
        document.getElementById('city-name').innerText = data.name;
        document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    }
}

// Declare a global variable to hold the Chart instance
let forecastChart;

// Function to render forecast chart
function renderForecastChart(data) {
    if (data) {
        const labels = data.list.map(item => new Date(item.dt_txt).toLocaleDateString());
        const temps = data.list.map(item => item.main.temp);

        const ctx = document.getElementById('forecast-chart').getContext('2d');

        // Check if the forecast chart already exists
        if (forecastChart) {
            // Update chart data
            forecastChart.data.labels = labels;
            forecastChart.data.datasets[0].data = temps;
            forecastChart.update();
        } else {
            // Create a new chart if it doesn't exist
            forecastChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: temps,
                        backgroundColor: 'rgba(58, 123, 213, 0.5)',
                        borderColor: '#3A7BD5',
                        fill: true
                    }]
                },
                options: {
                    scales: {
                        x: { display: true },
                        y: { beginAtZero: false }
                    }
                }
            });
        }
    }
}


// Function to search a city
async function searchCity() {
    const city = document.getElementById('city-search').value;
    if (city) {
        const weatherData = await getWeather(city);
        renderWeather(weatherData);

        const forecastData = await getForecast(city);
        renderForecastChart(forecastData);
    }
}


// Toggle theme between light and dark
function toggleTheme() {
    document.body.classList.toggle('dark');
    
    // Save theme preference in local storage
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
}

// Set theme based on user preference from local storage
function setThemeFromLocalStorage() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(savedTheme);
}

// Initial setup
async function init() {
    setThemeFromLocalStorage(); // Set theme on load

    // Default city weather
    const city = 'Vadodara';
    const weatherData = await getWeather(city);
    renderWeather(weatherData);

    // Forecast chart
    const forecastData = await getForecast(city);
    renderForecastChart(forecastData);
}

init();

