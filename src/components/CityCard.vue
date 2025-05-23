<template>
  <div class="flex flex-col gap-3">
    <div
      class="flex py-6 px-3 bg-transparent bg-gradient-to-r from-aceent-color to-another-accent backdrop-blur-lg backdrop-brightness-75 glass rounded-lg shadow-lg shadow-another-accent/25 cursor-pointer"
    >
      <div class="flex flex-col flex-1">
        <h2 class="text-3xl text-white font-bold">{{ city.city }}</h2>
        <h3 class="text-base text-white font-medium">{{ city.state }}</h3>
      </div>
     
      <div class="flex flex-col gap-2">
        <p class="text-3xl self-end font-bold text-white">
          {{ Math.round(city.weather.main.temp) }}&deg;c
        </p>
        <div class="flex gap-1 text-white font-medium">
          <span class="text-xs">
            H : {{ Math.round(city.weather.main.temp_max) }}&deg;c
          </span>
          <span class="text-xs">
            L : {{ Math.round(city.weather.main.temp_min) }}&deg;c
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  city: {
    type: Object,
    default: () => {},
  },
});
</script>
