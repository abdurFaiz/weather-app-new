<template>
  <main class="container text-black">
    <div class="pt-10 mb-8 relative">
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city or state"
        class="py-4 px-2 rounded-lg w-full bg-transparent border-b focus:border-secondary-color/5 focus:outline-none focus:shadow-lg transition duration-300"
      />
      <ul
        v-if="mapboxSearchResults"
        class="z-20 absolute bg-secondary-color rounded-md text-text-color w-full shadow-md py-3 px-3 top-[88px]"
      >
        <p v-if="searchErr">Sorry, something wrong please try again</p>
        <p v-if="!serverError && mapboxSearchResults.length === 0">
          Result not found, try a different term
        </p>
        <template v-else>
          <li
            v-for="seacrhResult in mapboxSearchResults"
            :key="seacrhResult.id"
            class="py2 cursor-pointer hover:text-aceent-color hover:font-medium"
            @click="previewCity(seacrhResult)"
          >
            {{ seacrhResult.place_name }}
          </li>
        </template>
      </ul>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList />
        <template #fallback>
          <CityCardSkelton />
        </template>
      </Suspense>
    </div>
  </main>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CityList from "../components/CityList.vue";
import CityCardSkelton from "../components/CityCardSkelton.vue";

const router = useRouter();
const previewCity = (seacrhResult) => {
  const [city, state] = seacrhResult.place_name.split(",");
  router.push({
    name: "cityView",
    params: {
      state: state.replaceAll(" ", ""),
      city: city,
    },
    query: {
      lat: seacrhResult.geometry.coordinates[1],
      lng: seacrhResult.geometry.coordinates[0],
      preview: true,
    },
  });
};
const mapboxAPIKey =
  "pk.eyJ1IjoiZmFpejk5MCIsImEiOiJjbHlmejNyenUwNHJmMmpwdzZlbWtqZG5kIn0.HtiRS0lZ4kwopTCpWC7aiw";
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);
const searchErr = ref(null);

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapboxAPIKey}&types=place`
        );
        mapboxSearchResults.value = result.data.features;
      } catch {
        searchErr.value = true;
      }
      return;
    }
    mapboxSearchResults.value = null;
  }, 300);
};
</script>
