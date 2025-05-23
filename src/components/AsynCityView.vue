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
    <!-- Weather Overview -->
    <div class="flex flex-col items-center py-12">
      <h1
        class=" text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent mb-1"
      >
        {{ route.params.city }}
      </h1>
      <p class="text-sm mb-8 font-medium text-text-color">
        {{
          new Date(weatherData.currentTime).toLocaleDateString("en-us", {
            weekday: "short",
            day: "2-digit",
            month: "long",
          })
        }}
        {{
          new Date(weatherData.currentTime).toLocaleTimeString("en-us", {
            timeStyle: "short",
          })
        }}
      </p>
      <div class="flex gap-2 items-center">
        <img
          class="size-32 md:size-40 mb-28"
          :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
          alt=""
        />
        <p
          class="text-4xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent font-bold mb-8"
        >
          {{ Math.round(weatherData.current.temp) }}&deg;c
        </p>
      </div>
      <div class="flex gap-2 items-center">
        <p class="text-base font-medium text-text-color">
          Feels like
          {{ Math.round(weatherData.current.feels_like) }} &deg;
        </p>
        <p class="font-semibold text-xl text-text-color">/</p>
        <p
          class="capitalize font-medium text-base text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent"
        >
          {{ weatherData.current.weather[0].description }}
        </p>
      </div>
    </div>

    <hr class="border-bltext-black border-opacity-10 border w-full" />

    <!-- Hourly Weather -->
    <div
      class="max-w-screen-md md:my-10 my-0 py-12 px-6 bg-gradient-to-r from-another-accent to-aceent-color rounded-xl shadow-lg shadow-aceent-color/30 outline outline-2 outline-white"
    >
      <div class="mx-0 md:mx-8 text-black">
        <div class="flex gap-2 items-center">
          <h2 class="mb-3 text-2xl font-semibold text-white">Hourly Weather</h2>
          <img src="/src/assets/icon/clouds-32.png" alt="" class="w-8 h-auto" />
        </div>
        <hr class="border-b text-black border-opacity-10 border w-full mb-6" />
        <div
          class="flex gap-6 py-6 overflow-x-scroll"
        >
          <div
            v-for="hourData in weatherData.hourly"
            :key="hourData.dt"
            class="flex flex-col gap-2 items-center text-white bg-white/50 py-3 rounded-lg backdrop-blur-lg border border-white/20 glass shadow-lg shadow-white/30 hover:-translate-y-3 hover:transition-all hover:duration-300 hover:shadow-xl hover:shadow-white/70"
          >
            <p class="text-white font-semibold text-base">
              {{
                new Date(hourData.currentTime).toLocaleTimeString("en-us", {
                  hour: "numeric",
                })
              }}
            </p>
            <img
              class="w-full h-16 object-cover"
              :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"
              alt=""
            />
            <p class="text-xl font-bold px-6">
              {{ Math.round(hourData.temp) }}&deg;c
            </p>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-b text-black border-opacity-10 border w-full" />

    <!-- Weekly Weather -->
    <div class="max-w-screen-sm w-full py-12">
      <div class="mx-8 text-black">
        <h2
          class="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent"
        >
          Weekly Weather Forecast
        </h2>
        <div
          v-for="day in weatherData.daily"
          :key="day.dt"
          class="flex items-center"
        >
          <p
            class="flex-1 text-base md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent"
          >
            {{
              new Date(day.dt * 1000).toLocaleDateString("en-us", {
                weekday: "long",
              })
            }}
          </p>
          <img
            class="size-20 object-cover"
            :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
            alt=""
          />
          <div class="flex gap-2 flex-1 justify-end text-base md:text-xl font-medium">
            <p>H: {{ Math.round(day.temp.max) }}&deg; c</p>
            <p>L: {{ Math.round(day.temp.min) }}&deg; c</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center gap-2 py-12 text-black cursor-pointer duration-150 hover:text-red-500"
      @click="removeCity"
    >
      <i class="fa-solid fa-trash"></i>
      <p>Remove City</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const getWeatherData = async () => {
  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=metric`
    );

    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = weatherData.data.current.dt * 1000 + localOffset;
    weatherData.data.currentTime =
      utc + 1000 * weatherData.data.timezone_offset;

    // cal hourly weather offset
    weatherData.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
    });

    // flicker delay
    await new Promise((res) => setTimeout(res, 500));

    return weatherData.data;
  } catch (err) {
    console.log(err);
  }
};
const weatherData = await getWeatherData();
const router = useRouter();
const removeCity = () => {
  const cities = JSON.parse(localStorage.getItem("savedCities"));
  const updatedCities = cities.filter((city) => city.id !== route.query.id);
  localStorage.setItem("savedCities", JSON.stringify(updatedCities));
  router.push({
    name: "home",
  });
};
</script>