<template>
  <div class="achievement-list">
    <h2>Succès</h2>
    <ul class="achievement-list__category-list">
      <li v-for="(list, key) in ACHIEVEMENTS" :key="key">
        <h3>{{ key }}</h3>
        <ul>
          <li v-for="(achievement, i) in list" :key="i">
            <Achievement :achievement="achievement" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import Achievement from '@/components/Achievements/Item.vue';

import { ACHIEVEMENTS } from '@/core/Achievement';

defineOptions({ name: 'AchievementList' });
</script>

<style lang="scss" src="./List.scss">
</style>
