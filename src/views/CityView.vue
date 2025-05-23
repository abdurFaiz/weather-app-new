<template>
  <div class="flex gap-4">
    <Suspense>
      <AsynCityView />
      <template #fallback>
        <CityViewSkelton/>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import AsynCityView from "../components/AsynCityView.vue";
import CityViewSkelton from "../components/CityViewSkelton.vue"
</script>
