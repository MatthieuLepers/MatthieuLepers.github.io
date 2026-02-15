<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

import { appStore } from '@/core/stores/appStore';
import { achievementsStore } from '@/core/entities/achievement/store';

gsap.registerPlugin(ScrollToPlugin, MotionPathPlugin);

onBeforeMount(async () => {
  await appStore.actions.load();
  await achievementsStore.actions.load();
});

onMounted(() => {
  appStore.processManager.start();

  window.addEventListener('wheel', (e) => {
    if (appStore.state.isScrolling) return;

    e.preventDefault();

    const direction = e.deltaY > 0 ? 1 : -1;

    appStore.actions.scrollToScreen(appStore.state.currentIndex + direction);
  }, { passive: false });
});
</script>

<style lang="scss" src="~styles/style.scss">
</style>
