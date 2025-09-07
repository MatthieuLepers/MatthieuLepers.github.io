<template>
  <div class="scene scene--r-type-web" ref="scene">
    <div class="ship" ref="ship">
      <img src="/img/blue.png" alt="" class="ship" />
      <img src="/img/r-type-web.gif" alt="" class="module" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const scene = ref<HTMLDivElement | null>(null);
const ship = ref<HTMLDivElement | null>(null);

onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    if (ship.value && scene.value) {
      const sceneBBox = scene.value.getBoundingClientRect();
      const shipBBox = ship.value.getBoundingClientRect();

      const newPos = {
        x: (e.clientX * (sceneBBox.width / window.innerWidth)) - (shipBBox.width / 2),
        y: (e.clientY * (sceneBBox.height / window.innerHeight)) - (shipBBox.height / 2),
      };
      ship.value.style.transform = `translate(${Math.min(sceneBBox.width - shipBBox.width, Math.max(0, newPos.x))}px, ${Math.min(sceneBBox.height - shipBBox.height, Math.max(0, newPos.y))}px)`;
    }
  });
});
</script>

<style lang="scss">
@use '../Scene';

@keyframes backgroundScroll {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -600px 0;
  }
}

.scene--r-type-web {
  background-image: url('/img/background.png');
  background-repeat: repeat-x;
  animation: backgroundScroll 10s linear infinite;
  position: relative;
  border-radius: 24px;

  img {
    width: auto;
  }

  .ship {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
  }
}
</style>
