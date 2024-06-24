document.getElementById("getWeather").addEventListener("click", function() {
    const city = document.getElementById("city").value;
    const units = document.getElementById("units").value;
    if (city) {
        getWeather(city, units);
    } else {
        alert("Please enter a city name.");
    }
});

document.getElementById("getLocationWeather").addEventListener("click", function() {
    const units = document.getElementById("units").value;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByLocation(lat, lon, units);
        }, function(error) {
            alert("Unable to retrieve your location.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

async function getWeather(city, units) {
    const apiKey = "a76b3aa1f366db199406e6441da00945";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        displayWeather(data, units);
    } catch (error) {
        document.getElementById("weatherInfo").innerHTML = `<p>${error.message}</p>`;
    }
}

async function getWeatherByLocation(lat, lon, units) {
    const apiKey = "a76b3aa1f366db199406e6441da00945";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Unable to retrieve weather data");
        }
        const data = await response.json();
        displayWeather(data, units);
    } catch (error) {
        document.getElementById("weatherInfo").innerHTML = `<p>${error.message}</p>`;
    }
}

function displayWeather(data, units) {
    const tempUnit = units === "metric" ? "°C" : "°F";
    const weatherInfo = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${data.main.temp}${tempUnit}</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    document.getElementById("weatherInfo").innerHTML = weatherInfo;
}