const apiKey = 'f1a7f601f87c9d97579ef8237cc83ff1';
const city = 'balanga';
const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

let isCelsius = true;

document.addEventListener('DOMContentLoaded', () => {
    fetchCurrentWeather();
    fetchForecast();
    setBackground();
    document.getElementById('toggle-temp').addEventListener('click', toggleTemperature);
});

function fetchCurrentWeather() {
    axios.get(currentWeatherUrl).then(response => {
        const data = response.data;
        const location = data.name;
        const date = new Date().toLocaleDateString();
        const temp = isCelsius ? (data.main.temp - 273.15).toFixed(1) : ((data.main.temp - 273.15) * 9/5 + 32).toFixed(1);
        const weatherImg = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

        document.getElementById('location').innerText = location;
        document.getElementById('date').innerText = date;
        document.getElementById('current-temp').innerText = `Current Temperature: ${temp}°${isCelsius ? 'C' : 'F'}`;
        document.getElementById('current-weather-img').innerHTML = `<img src="${weatherImg}" alt="Weather icon">`;
    });
}

function fetchForecast() {
    axios.get(forecastUrl).then(response => {
        const data = response.data;
        const forecastContainer = document.getElementById('daily-forecast');
        forecastContainer.innerHTML = '';

        for (let i = 0; i < data.list.length; i += 8) {
            const forecast = data.list[i];
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            const minTemp = isCelsius ? (forecast.main.temp_min - 273.15).toFixed(1) : ((forecast.main.temp_min - 273.15) * 9/5 + 32).toFixed(1);
            const maxTemp = isCelsius ? (forecast.main.temp_max - 273.15).toFixed(1) : ((forecast.main.temp_max - 273.15) * 9/5 + 32).toFixed(1);
            const weatherImg = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

            const forecastElement = document.createElement('div');
            forecastElement.innerHTML = `
                <div>${date}</div>
                <div><img src="${weatherImg}" alt="Weather icon"></div>
                <div>Min: ${minTemp}°${isCelsius ? 'C' : 'F'}</div>
                <div>Max: ${maxTemp}°${isCelsius ? 'C' : 'F'}</div>
                <button onclick="showMoreInfo(${i})">More Info</button>
            `;
            forecastContainer.appendChild(forecastElement);
        }
    });
}

function showMoreInfo(index) {
    axios.get(forecastUrl).then(response => {
        const data = response.data;
        const hourlyForecast = data.list.slice(index, index + 8);
        const hourlyContainer = document.getElementById('hourly-forecast');
        hourlyContainer.innerHTML = '';

        const times = [];
        const temps = [];

        hourlyForecast.forEach(forecast => {
            const time = new Date(forecast.dt * 1000).toLocaleTimeString();
            const temp = isCelsius ? (forecast.main.temp - 273.15).toFixed(1) : ((forecast.main.temp - 273.15) * 9/5 + 32).toFixed(1);
            const weatherImg = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
            const rain = forecast.rain ? forecast.rain['3h'] : 0;
            const wind = forecast.wind.speed;

            times.push(time);
            temps.push(temp);

            const forecastElement = document.createElement('div');
            forecastElement.innerHTML = `
                <div>${time}</div>
                <div><img src="${weatherImg}" alt="Weather icon"></div>
                <div>Temp: ${temp}°${isCelsius ? 'C' : 'F'}</div>
                <div>Rain: ${rain} mm</div>
                <div>Wind: ${wind} m/s</div>
            `;
            hourlyContainer.appendChild(forecastElement);
        });

        renderChart(times, temps);
        document.getElementById('more-info').style.display = 'block';
    });
}

function renderChart(labels, data) {
    const ctx = document.getElementById('hourly-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Temperature (°${isCelsius ? 'C' : 'F'})`,
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function toggleTemperature() {
    isCelsius = !isCelsius;
    fetchCurrentWeather();
    fetchForecast();
}

function setBackground() {
    const key = 'YOUR_PIXABAY_API_KEY';
    const url = `https://pixabay.com/api/?key=${key}&q=nature&image_type=photo`;
    axios.get(url).then(response => {
        const images = response.data.hits;
        const randomImage = images[Math.floor(Math.random() * images.length)].largeImageURL;
        document.body.style.backgroundImage = `url(${randomImage})`;
    });
}
