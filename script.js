let weather = {
  apiKey: "8bc64561b230380e73c7048ff1d019e8",
  fetchWeather: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  fetchForecast: function (city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`
    )
      .then((response) => response.json())
      .then((data) => this.displayForecast(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + speed + " km/h";

    this.fetchForecast(name);
  },
  displayForecast: function (data) {
    const forecastContainer = document.getElementById("weather-forecast");
    forecastContainer.innerHTML = "";
    const dailyForecasts = data.list.filter((_, index) => index % 8 === 0); // Every 8th entry for daily forecast

    dailyForecasts.forEach((forecast) => {
      const { dt_txt } = forecast;
      const { icon } = forecast.weather[0];
      const { temp_min, temp_max } = forecast.main;

      forecastContainer.innerHTML += `
        <div class="forecast-item">
          <div>${new Date(dt_txt).toLocaleDateString("en-US", {
            weekday: "long",
          })}</div>
          <img src="https://openweathermap.org/img/wn/${icon}.png" />
          <div>Min: ${temp_min.toFixed(1)}°C</div>
          <div>Max: ${temp_max.toFixed(1)}°C</div>
        </div>`;
    });
  },
  search: function () {
    const city = document.querySelector(".search-bar").value;
    this.fetchWeather(city);
  },
};

document.querySelector(".search button").addEventListener("click", () => {
  weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", (e) => {
  if (e.key === "Enter") weather.search();
});

weather.fetchWeather("Udupi");
