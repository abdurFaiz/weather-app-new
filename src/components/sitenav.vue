<template>
  <header class="relative bg-primary-color shadow-lg">
    <nav
      class="container flex flex-col sm:flex-row items-center gap-4 text-text-color py-5"
    >
      <router-link :to="{ name: 'home' }">
        <div class="flex items-center gap-3">
          <p
            class="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-aceent-color to-another-accent"
          >
            SkywardForecasts
          </p>
          <img src="../assets/icon/wind-48.png" alt="" />
        </div>
      </router-link>
      <div class="flex gap-4 flex-1 justify-end">
        <div
          class="tooltip tooltip-bottom tooltip-info"
          data-tip="How SkywardForecasts Works"
        >
          <i
            @click="toggleModel"
            class="fa-solid fa-circle-info text-xl text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent hover:bg-gradient-to-tr hover:from-aceent-color hover:to-another-accent duration-150 cursor-pointer"
          ></i>
        </div>
        <i
          class="fa-solid fa-plus text-xl text-transparent bg-clip-text bg-gradient-to-r from-aceent-color to-another-accent hover:bg-gradient-to-tr hover:from-aceent-color hover:to-another-accent duration-150 cursor-pointer"
          @click="addCity"
          v-if="route.query.preview"
        ></i>
      </div>
      <basemodal :modal-active="modalActive" @close-modal="toggleModel">
        <h1 class="text-2xl font-bold mb-1 text-text-color">About:</h1>
        <p class="mb-4 text-hover-color text-base">
          With SkywardForecasts, you can effortlessly track the present and
          forecasted weather for any cities you select
        </p>
        <h2 class="text-2xl mb-1 text-text-color font-bold">How it works:</h2>
        <ol class="list-decimal list-inside mb-4 text-hover-color">
          <li>
            Search for your city by entering the name into the search bar.
          </li>
          <li>
            Select a city within the results, this will take you to the current
            weather for your selection.
          </li>
          <li>
            Add a city by clicking the "+" icon in the top right corner. This
            action will save the city, allowing you to easily view its weather
            updates on the home page later.
          </li>
        </ol>
        <h2 class="text-2xl font-bold text-text-color mb-1">
          Removing Cities from Your Dashboard
        </h2>
        <p class="text-hover-color">
          If you no longer want to monitor a city, select it from the home page,
          where you'll find an option to delete it at the bottom.
        </p>
      </basemodal>
    </nav>
  </header>
</template>

<script setup>
import { uid } from "uid";
import { RouterLink, useRoute, useRouter } from "vue-router";
import basemodal from "./basemodal.vue";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();
const savedCities = ref([]);
const addCity = () => {
  if (localStorage.getItem("savedCities")) {
    savedCities.value = JSON.parse(localStorage.getItem("savedCities"));
  }
  const locationObj = {
    id: uid(),
    state: route.params.state,
    city: route.params.city,
    coords: {
      lat: route.query.lat,
      lng: route.query.lng,
    },
  };

  savedCities.value.push(locationObj);
  localStorage.setItem("savedCities", JSON.stringify(savedCities.value));
  let query = Object.assign({}, route.query);
  delete query.preview;
  query.id = locationObj.id;
  router.replace({ query });
};
const modalActive = ref(null);
const toggleModel = () => {
  modalActive.value = !modalActive.value;
};
</script>

<style scoped>
.tooltip {
  --tooltip-text-color: #fff;
}
</style>

