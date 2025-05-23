<template>
  <teleport to="body">
    <transition name="modal-outer">
      <div
        v-show="modalActive"
        class="absolute w-full bg-black/60 h-screen top-0 left-0 flex justify-center px-8 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <transition name="modal-inner">
          <div
            v-if="modalActive"
            class="p-6 bg-gradient-eccent rounded-md self-start mt-32 max-w-screen-md"
          >
            <slot />
            <button
              class="text-white font-medium mt-8 bg-aceent-color hover:bg-aceent-color hover:contrast-125 py-2 px-6 rounded-lg"
              @click="closeModal"
            >
              Close
            </button>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>
  
<script setup>
import { onMounted, onUnmounted } from "vue";

const emit = defineEmits(["close-modal"]);
const props = defineProps({
  modalActive: {
    type: Boolean,
    default: false,
  },
});

const closeModal = () => {
  emit("close-modal");
};

const handleEsc = (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEsc);
});
</script>

<style scoped>
.modal-outer-enter-active,
.modal-outer-leave-active {
  transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.modal-outer-enter-from,
.modal-outer-leave-to {
  opacity: 0;
}
.modal-inner-leave-active,
.modal-inner-enter-active {
  transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1),
    transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.modal-inner-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.modal-inner-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
