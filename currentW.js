document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetchCurrentWeather(city);
});

document.querySelectorAll('input[name="unit"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const city = document.getElementById('cityInput').value;
        if (city) {
            fetchCurrentWeather(city);
        }
    });
});

function getSelectedUnit() {
    return document.querySelector('input[name="unit"]:checked').value;
}

function fetchCurrentWeather(city) {
    const unit = getSelectedUnit();
    const apiKey = 'f1a7f601f87c9d97579ef8237cc83ff1';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            const icon = data.weather[0].icon;
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            const unitSymbol = unit === 'metric' ? '°C' : '°F';

            const weatherInfo = `
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
                <p>Weather: ${weatherDescription}</p>
                <p>Temperature: ${temperature}${unitSymbol}</p>
                <p>Sunrise: ${sunrise}</p>
                <p>Sunset: ${sunset}</p>
            `;
            document.getElementById('currentforecast').innerHTML = weatherInfo;

            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const currentDate = new Date().toLocaleDateString(undefined, options);
            document.getElementById('currentdate').innerText = `Date: ${currentDate}`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('currentforecast').innerText = 'Error fetching weather data';
            document.getElementById('currentdate').innerText = '';
        });
}
