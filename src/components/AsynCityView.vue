<template>
  <div class="flex flex-col flex-1 items-center">
    <!-- Banner -->
    <div
      v-if="route.query.preview"
      class="mt-5 font-medium text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent p-4 bg-weather-secondary w-full text-center"
    >
      <p>
        You're currently previewing this city. Click the '+' icon to add it to
        your tracking list.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center py-12">
      <p class="text-xl font-medium text-text-color">Loading weather data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center py-12">
      <p class="text-xl font-medium text-red-500">{{ error }}</p>
      <button
        @click="retryWeatherData"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <!-- Weather Content -->
    <template v-else-if="weatherData">
      <!-- Weather Overview -->
      <div class="flex flex-col items-center py-12">
        <h1
          class="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent mb-1"
        >
          {{ route.params.city }}
        </h1>
        <p
          class="text-sm mb-8 font-medium text-text-color"
          v-if="weatherData.current"
        >
          {{
            new Date(weatherData.current.dt * 1000).toLocaleDateString(
              "en-us",
              {
                weekday: "short",
                day: "2-digit",
                month: "long",
              }
            )
          }}
          {{
            new Date(weatherData.current.dt * 1000).toLocaleTimeString(
              "en-us",
              {
                timeStyle: "short",
              }
            )
          }}
        </p>
        <div class="flex gap-2 items-center" v-if="weatherData.current">
          <img
            class="size-32 md:size-40 mb-28"
            :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
            alt=""
          />
          <p
            class="text-4xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent font-bold mb-8"
          >
            {{ Math.round(weatherData.current.main.temp) }}&deg;C
          </p>
        </div>
        <div class="flex gap-2 items-center" v-if="weatherData.current">
          <p class="text-base font-medium text-text-color">
            Feels like
            {{ Math.round(weatherData.current.main.feels_like) }} &deg;C
          </p>
          <p class="font-semibold text-xl text-text-color">/</p>
          <p
            class="capitalize font-medium text-base text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent"
          >
            {{ weatherData.current.weather[0].description }}
          </p>
        </div>

        <!-- Additional Weather Info -->
        <div class="mt-8 grid grid-cols-2 gap-4 text-center">
          <div class="bg-white/10 rounded-lg p-4">
            <p class="text-sm text-text-color">Humidity</p>
            <p
              class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent"
            >
              {{ weatherData.current.main.humidity }}%
            </p>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <p class="text-sm text-text-color">Wind Speed</p>
            <p
              class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent"
            >
              {{ Math.round(weatherData.current.wind?.speed || 0) }} m/s
            </p>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <p class="text-sm text-text-color">Pressure</p>
            <p
              class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent"
            >
              {{ weatherData.current.main.pressure }} hPa
            </p>
          </div>
          <div class="bg-white/10 rounded-lg p-4">
            <p class="text-sm text-text-color">Visibility</p>
            <p
              class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent"
            >
              {{ Math.round((weatherData.current.visibility || 0) / 1000) }} km
            </p>
          </div>
        </div>
      </div>

      <hr class="border-bltext-black border-opacity-10 border w-full" />

      <!-- 5-Day Forecast -->
      <div
        v-if="weatherData.forecast && weatherData.forecast.length > 0"
        class="max-w-screen-md md:my-10 my-0 py-12 px-6 bg-gradient-to-r from-another-accent to-aceent-color rounded-xl shadow-lg shadow-aceent-color/30 outline outline-2 outline-white"
      >
        <div class="mx-0 md:mx-8 text-black">
          <div class="flex gap-2 items-center">
            <h2 class="mb-3 text-2xl font-semibold text-white">
              5-Day Forecast
            </h2>
            <img
              src="/src/assets/icon/clouds-32.png"
              alt=""
              class="w-8 h-auto"
            />
          </div>
          <hr
            class="border-b text-white border-opacity-10 border w-full mb-6"
          />
          <div class="flex gap-6 py-6 overflow-x-scroll">
            <div
              v-for="day in weatherData.forecast"
              :key="day.dt"
              class="flex flex-col gap-2 items-center text-white bg-white/50 py-3 px-4 rounded-lg backdrop-blur-lg border border-white/20 glass shadow-lg shadow-white/30 hover:-translate-y-3 hover:transition-all hover:duration-300 hover:shadow-xl hover:shadow-white/70 min-w-[120px]"
            >
              <p class="text-white font-semibold text-base">
                {{
                  new Date(day.dt * 1000).toLocaleDateString("en-us", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                }}
              </p>
              <img
                class="w-16 h-16 object-cover"
                :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                alt=""
              />
              <p class="text-lg font-bold">
                {{ Math.round(day.main.temp) }}&deg;C
              </p>
              <p class="text-sm opacity-80">
                {{ day.weather[0].description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Remove City Button -->
      <div
        v-if="!route.query.preview"
        class="flex items-center gap-2 py-12 text-black cursor-pointer duration-150 hover:text-red-500"
        @click="removeCity"
      >
        <i class="fa-solid fa-trash"></i>
        <p>Remove City</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Reactive state
const weatherData = ref(null);
const loading = ref(true);
const error = ref(null);

const API_KEY = "b7d52d1c1eec0b7d7627d5f86bb6f719";

const getWeatherData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Get current weather data (free API)
    const currentWeatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: route.query.lat,
          lon: route.query.lng,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    // Get 5-day forecast (free API)
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          lat: route.query.lat,
          lon: route.query.lng,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    // Process forecast data to get daily summaries (take one per day around noon)
    const dailyForecasts = [];
    const processedDates = new Set();

    forecastResponse.data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      const hour = new Date(item.dt * 1000).getHours();

      // Take the forecast around noon (12 PM) for each day
      if (!processedDates.has(date) && hour >= 11 && hour <= 13) {
        dailyForecasts.push(item);
        processedDates.add(date);
      }
    });

    // If we don't have enough noon forecasts, fill with available data
    if (dailyForecasts.length < 5) {
      const remainingDates = new Set();
      forecastResponse.data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!processedDates.has(date) && dailyForecasts.length < 5) {
          dailyForecasts.push(item);
          remainingDates.add(date);
          processedDates.add(date);
        }
      });
    }

    // Structure the data
    weatherData.value = {
      current: currentWeatherResponse.data,
      forecast: dailyForecasts.slice(0, 5), // Limit to 5 days
    };

    loading.value = false;
  } catch (err) {
    console.error("Weather API Error:", err);
    loading.value = false;

    if (err.response?.status === 401) {
      error.value =
        "Invalid API key or API access denied. Please check your OpenWeatherMap API key and ensure it's activated.";
    } else if (err.response?.status === 429) {
      error.value = "API rate limit exceeded. Please try again later.";
    } else if (err.response?.status === 404) {
      error.value = "Location not found. Please check the coordinates.";
    } else {
      error.value = `Failed to fetch weather data: ${err.message}`;
    }
  }
};

const retryWeatherData = () => {
  getWeatherData();
};

const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities") || "[]");
  const updatedCities = cities.filter((city) => city.id !== route.query.id);
  localStorage.setItem("savedCities", JSON.stringify(updatedCities));
  router.push({
    name: "home",
  });
};

// Load weather data when component mounts
onMounted(() => {
  getWeatherData();
});
</script>