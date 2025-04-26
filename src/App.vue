<template>
  <router-view />
</template>

<script setup>
import { onMounted, onBeforeMount } from 'vue';

import { appStore } from '@/core/stores/appStore';

onBeforeMount(() => {
  appStore.actions.load();
});

onMounted(() => {
  appStore.state.processManager.start();
});
</script>

<style lang="scss" src="~styles/style.scss">
</style>
