document.getElementById("getWeather").addEventListener("click", function() {
    const city = document.getElementById("city").value;
    const units = document.getElementById("units").value;
    if (city) {
        getWeather(city, units);
    } else {
        alert("Please enter a city name.");
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