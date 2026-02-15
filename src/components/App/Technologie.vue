<template>
  <div :class="GenerateModifiers('app-technologie', {
    'with-tooltip': props.tooltip,
  })">
    <img :src="props.technologie.logo" alt="" />

    <abbr v-if="props.technologie.abbreviation" :title="props.technologie.abbreviation">
      {{ props.technologie.label }}
    </abbr>
    <span v-else>
      {{ props.technologie.label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { ITechnologie } from '@/projects';

defineOptions({ name: 'AppTechnologie' });

const props = withDefaults(defineProps<{
  technologie: ITechnologie;
  tooltip?: boolean;
}>(), {
  tooltip: false,
});
</script>

<style lang="scss" src="./Technologie.scss">
</style>
