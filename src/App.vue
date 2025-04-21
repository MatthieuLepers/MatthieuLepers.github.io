<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';

import { appStore } from '@/core/stores/appStore';

onMounted(() => {
  appStore.state.processManager.start();
});
</script>

<style lang="scss" src="~styles/style.scss">
</style>
