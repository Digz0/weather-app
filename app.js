const apiKey = "a76b3aa1f366db199406e6441da00945"; // Replace with your actual API key

document.getElementById("getWeather").addEventListener("click", function() {
    const city = document.getElementById("city").value.trim();
    const units = document.getElementById("units").value;
    if (city) {
        getWeather(city, units);
    } else {
        displayError("Please enter a city name.");
    }
});

document.getElementById("getLocationWeather").addEventListener("click", function() {
    const units = document.getElementById("units").value;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByLocation(lat, lon, units);
        }, () => {
            displayError("Unable to retrieve your location.");
        });
    } else {
        displayError("Geolocation is not supported by this browser.");
    }
});

async function getWeather(city, units) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        displayWeather(data, units);
    } catch (error) {
        displayError(error.message);
    }
}

async function getWeatherByLocation(lat, lon, units) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Unable to retrieve weather data");
        }
        const data = await response.json();
        displayWeather(data, units);
    } catch (error) {
        displayError(error.message);
    }
}

function displayWeather(data, units) {
    const tempUnit = units === "metric" ? "°C" : "°F";
    const windSpeedUnit = units === "metric" ? "m/s" : "miles/h";
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    const weatherInfo = `
        <div class="weather-header">
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
        </div>
        <p>Temperature: ${data.main.temp.toFixed(1)}${tempUnit}</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} ${windSpeedUnit}</p>
    `;
    document.getElementById("weatherInfo").innerHTML = weatherInfo;
}

function displayError(message) {
    document.getElementById("weatherInfo").innerHTML = `<p class="error">${message}</p>`;
}