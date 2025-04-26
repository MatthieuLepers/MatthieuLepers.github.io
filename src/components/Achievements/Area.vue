<template>
  <div class="achievement-area">
    <Achievement
      v-for="(ach, i) in appStore.state.achievementList"
      :key="i"
      :achievement="ach"
      :acquire="true"
    />
  </div>
</template>

<script setup lang="ts">
import Achievement from '@/components/Achievements/Item.vue';

import { appStore } from '@/core/stores/appStore';
</script>

<style lang="scss" src="./Area.scss">
</style>
