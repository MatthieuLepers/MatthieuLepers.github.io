<template>
  <div class="achievement-area">
    <Achievement
      v-for="(achivementId, i) in achievementsStore.state.waitForAcquire"
      :key="i"
      :achievement="achievementsStore.actions.getAchivementById(achivementId)"
      :acquire="true"
    />
  </div>
</template>

<script setup lang="ts">
import Achievement from '@/components/Achievements/Item.vue';

import { achievementsStore } from '@/core/entities/achievement/store';
</script>

<style lang="scss" src="./Area.scss">
</style>
