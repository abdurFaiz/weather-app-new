<template>
  <div class="flex flex-col min-h-screen font-Roboto bg-primary-color">
    <sitenav />
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import sitenav from "./components/sitenav.vue";
import { Transition } from "vue";
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: 600ms ease all;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

