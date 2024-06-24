document.getElementById("getWeather").addEventListener("click", function() {
    const city = document.getElementById("city").value;
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});

function getWeather(city) {
    // Placeholder for API call
    document.getElementById("weatherInfo").innerHTML = `Fetching weather for ${city}...`;
}
