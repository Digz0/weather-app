const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const storage = localStorage;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("apiKey").value = storage.getItem('apiKey') || '';
    document.getElementById("getWeather").addEventListener("click", getWeather);
    document.getElementById("getLocationWeather").addEventListener("click", getLocationWeather);
    document.getElementById("city").addEventListener("keypress", e => e.key === "Enter" && getWeather());
    document.getElementById("metricUnit").addEventListener("click", () => setUnit("metric"));
    document.getElementById("imperialUnit").addEventListener("click", () => setUnit("imperial"));
});

function setUnit(unit) {
    ["metricUnit", "imperialUnit"].forEach(id => 
        document.getElementById(id).classList.toggle("active", id.startsWith(unit))
    );
}

async function getWeather() {
    const city = document.getElementById("city").value.trim();
    if (!city) return showMessage("Please enter a city name.", "error");
    fetchWeather(`${BASE_URL}?q=${city}&units=${getUnits()}`);
}

function getLocationWeather() {
    if (!navigator.geolocation) return showMessage("Geolocation is not supported by this browser.", "error");
    
    showMessage("Loading weather data...");
    navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(`${BASE_URL}?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=${getUnits()}`),
        () => showMessage("Unable to retrieve your location.", "error")
    );
}

async function fetchWeather(url) {
    const apiKey = document.getElementById("apiKey").value.trim();
    if (!apiKey) return showMessage("Please enter your API key.", "error");
    storage.setItem('apiKey', apiKey);
    
    try {
        const response = await fetch(`${url}&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found or unable to retrieve weather data.");
        displayWeather(await response.json());
    } catch (error) {
        showMessage(error.message, "error");
    }
}

function displayWeather(data) {
    const units = getUnits();
    const tempUnit = units === 'imperial' ? '°F' : '°C';
    const speedUnit = units === 'imperial' ? 'mph' : 'm/s';
    
    document.getElementById("weatherInfo").innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><i class="${getWeatherIconClass(data.weather[0].icon)}"></i> ${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp.toFixed(1)}${tempUnit}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed.toFixed(1)} ${speedUnit}</p>
    `;
}

function getUnits() {
    return document.getElementById("metricUnit").classList.contains("active") ? "metric" : "imperial";
}

function getWeatherIconClass(iconCode) {
    const iconMap = {
        '01': 'wi-day-sunny', '02': 'wi-day-cloudy', '03': 'wi-cloud', '04': 'wi-cloudy',
        '09': 'wi-showers', '10': 'wi-day-rain', '11': 'wi-thunderstorm',
        '13': 'wi-snow', '50': 'wi-fog'
    };
    return `wi ${iconMap[iconCode.slice(0, 2)] || 'wi-na'}`;
}

function showMessage(message, type = "") {
    document.getElementById("weatherInfo").innerHTML = `<p class="${type}">${message}</p>`;
}
