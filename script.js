const weather = {
  apiKey: "8bc64561b230380e73c7048ff1d019e8",
  
  // Fetch current weather data
  async fetchWeather(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
      );
      if (!response.ok) {
        throw new Error("No weather found for this city.");
      }
      const data = await response.json();
      this.displayWeather(data);
    } catch (error) {
      alert(error.message);
      console.error("Weather fetch error:", error);
    }
  },

  // Fetch 5-day forecast data
  async fetchForecast(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`
      );
      if (!response.ok) {
        throw new Error("Forecast unavailable.");
      }
      const data = await response.json();
      this.displayForecast(data);
    } catch (error) {
      console.error("Forecast fetch error:", error);
    }
  },

  // Display current weather
  displayWeather(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").textContent = `Weather in ${name}`;
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
    document.querySelector(".icon").alt = `${description} weather icon`; // Accessibility
    document.querySelector(".description").textContent = description;
    document.querySelector(".temp").textContent = `${temp.toFixed(1)}°C`;
    document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
    document.querySelector(".wind").textContent = `Wind speed: ${speed} km/h`;
    document.querySelector(".weather").classList.remove("loading");

    // Fetch forecast after current weather loads
    this.fetchForecast(name);
  },

  // Display 5-day forecast
  displayForecast(data) {
    const forecastContainer = document.getElementById("weather-forecast");
    forecastContainer.innerHTML = ""; // Clear previous forecast

    // Filter to one entry per day (every 8th item, ~24 hours)
    const dailyForecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);

    dailyForecasts.forEach((forecast) => {
      const { dt_txt } = forecast;
      const { icon } = forecast.weather[0];
      const { temp_min, temp_max } = forecast.main;

      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
        <p>${new Date(dt_txt).toLocaleDateString("en-US", { weekday: "short" })}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon" />
        <p>Min: ${temp_min.toFixed(1)}°C</p>
        <p>Max: ${temp_max.toFixed(1)}°C</p>
      `;
      forecastContainer.appendChild(forecastItem);
    });
  },

  // Handle search input
  search() {
    const city = document.querySelector(".search-bar").value.trim();
    if (city) {
      document.querySelector(".weather").classList.add("loading");
      this.fetchWeather(city);
    }
  },
};

// Event Listeners
document.querySelector(".search button").addEventListener("click", () => weather.search());
document.querySelector(".search-bar").addEventListener("keyup", (e) => {
  if (e.key === "Enter") weather.search();
});

// Initial load
weather.fetchWeather("Udupi");
