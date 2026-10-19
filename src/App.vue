<template>
  <router-view />
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { onBeforeMount,onMounted } from 'vue';

import { analyticsStore } from '@/core/analytics/store';
import { achievementsStore } from '@/core/entities/achievement/store';
import { appStore } from '@/core/stores/appStore';

gsap.registerPlugin(ScrollToPlugin, MotionPathPlugin);

onBeforeMount(async () => {
  await appStore.actions.load();
  await achievementsStore.actions.load();
});

onMounted(() => {
  analyticsStore.actions.setup();
  appStore.processManager.start();

  window.addEventListener('wheel', (e) => {
    if (appStore.state.isScrolling) return;

    e.preventDefault();

    const direction = e.deltaY > 0 ? 1 : -1;

    appStore.actions.scrollToScreen(appStore.state.currentIndex + direction, 'scroll');
  }, { passive: false });
});
</script>

<style lang="scss" src="~styles/style.scss">
</style>
