<template>
  <ul :class="GenerateModifiers('app-technologie-list', {
    [`grid-${props.perRow}`]: true,
  })">
    <li
      v-for="(technologie, i) in props.technologies"
      :key="i"
      class="app-technologie-list__item"
    >
      <AppTooltip
        v-if="technologie.tooltip"
        :text="technologie.tooltip"
      >
        <AppTechnologie
          :technologie="technologie"
          :tooltip="true"
        />
      </AppTooltip>
      <AppTechnologie
        v-else
        :technologie="technologie"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import AppTechnologie from '@/components/App/Technologie.vue';
import AppTooltip from '@/components/App/Tooltip.vue';

import type { ITechnologie } from '@/projects';

const props = withDefaults(defineProps<{
  technologies?: Array<ITechnologie>;
  perRow?: number;
}>(), {
  technologies: () => [],
  perRow: 8,
});
</script>

<style lang="scss" src="./TechnologieList.scss">
</style>
