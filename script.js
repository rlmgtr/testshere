document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    fetchWeather(city);
});

function fetchWeather(city) {
    const apiKey = 'f1a7f601f87c9d97579ef8237cc83ff1';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const forecast = data.list.reduce((acc, item) => {
            const date = item.dt_txt.split(' ')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});

        displayForecast(forecast);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displayForecast(forecast) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    for (const date in forecast) {
        const dayForecast = forecast[date];
        const minTemp = Math.min(...dayForecast.map(item => item.main.temp_min));
        const maxTemp = Math.max(...dayForecast.map(item => item.main.temp_max));
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        const iconUrl = `https://openweathermap.org/img/w/${dayForecast[0].weather[0].icon}.png`;
        dayElement.innerHTML = `
            <div>${new Date(dayForecast[0].dt * 1000).toDateString()}</div>
            <img src="${iconUrl}" alt="${dayForecast[0].weather[0].description}">
            <div>Min Temp: ${minTemp}°C</div>
            <div>Max Temp: ${maxTemp}°C</div>
        `;
        dayElement.addEventListener('click', function() {
            displayWeatherInfo(dayForecast);
        });
        forecastContainer.appendChild(dayElement);
    }
}

function displayWeatherInfo(weatherData) {
    const weatherInfoContainer = document.getElementById('weatherInfo');
    weatherInfoContainer.innerHTML = '';

    weatherData.forEach(item => {
        const weatherElement = document.createElement('div');
        const time = new Date(item.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const temperature = item.main.temp;
        const description = item.weather[0].description;
        const clouds = item.clouds.all;
        const windSpeed = item.wind.speed;
        const visibility = item.visibility / 1000; // Convert visibility to kilometers
        const iconUrl = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;

        weatherElement.innerHTML = `
            <div>${time}</div>
            <img src="${iconUrl}" alt="${description}">
            <div>Temperature: ${temperature}°C</div>
            <div>Description: ${description}</div>
            <div>Clouds: ${clouds}% <img src="cloud-icon.png" alt="Clouds"></div>
            <div>Wind Speed: ${windSpeed} m/s <img src="wind-icon.png" alt="Wind"></div>
            <div>Visibility: ${visibility} km <img src="visibility-icon.png" alt="Visibility"></div>
        `;
        weatherInfoContainer.appendChild(weatherElement);
    });

    weatherInfoContainer.classList.remove('hide');
}
