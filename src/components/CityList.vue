<template>
  <div class="grid grid-rows-1 md:grid-cols-3 gap-4">
    <div v-for="city in savedCites" :key="city.id">
      <CityCard :city="city" @click="goToCityView(city)" />
    </div>

    <p v-if="savedCites.length === 0">
      No location added. To start tracking a location, search in the field
      above.
    </p>
  </div>
</template>
    
  <script setup>
import axios from "axios";
import { ref } from "vue";
import CityCard from "../components/CityCard.vue";
import { useRouter } from "vue-router";

const savedCites = ref([]);
const getCites = async () => {
  if (localStorage.getItem("savedCities")) {
    savedCites.value = JSON.parse(localStorage.getItem("savedCities"));
    const requests = [];
    savedCites.value.forEach((city) => {
      requests.push(
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=metric`
        )
      );
    });
    const weatherData = await Promise.all(requests);

    // flicker delay
    await new Promise((res) => setTimeout(res, 500));

    weatherData.forEach((value, index) => {
      savedCites.value[index].weather = value.data;
    });
  }
};
await getCites();
const router = useRouter();
const goToCityView = (city) => {
  router.push({
    name: "cityView",
    params: { state: city.state, city: city.city },
    query: { id: city.id, lat: city.coords.lat, lng: city.coords.lng },
  });
};
</script>
