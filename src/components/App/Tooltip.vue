<template>
  <div
    @mouseenter="actions.onMouseEnter"
    @mousemove="actions.onMouseMove"
    @mouseleave="actions.onMouseLeave"
  >
    <slot />
  </div>

  <Teleport to="body">
    <div
      v-if="visible"
      class="app-tooltip"
      :style="{
        left: `${x}px`,
        top: `${y - props.offset}px`,
      }"
    >
      {{ props.text }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  text: string
  offset?: number
}>(), {
  offset: 16,
});

const visible = ref(false);
const x = ref(0);
const y = ref(0);

const actions = {
  onMouseEnter() {
    visible.value = true;
  },
  onMouseMove(e: MouseEvent) {
    x.value = e.clientX;
    y.value = e.clientY;
  },
  onMouseLeave() {
    visible.value = false;
  },
};
</script>

<style lang="scss" src="./Tooltip.scss">
</style>
