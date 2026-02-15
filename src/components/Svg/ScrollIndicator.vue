<template>
  <svg
    viewBox="0 0 59 59"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="scroll-indicator"
    :transform="TRANSLATE_MAP[props.direction]"
  >
    <path
      d="M32.2843 57.8284C30.7222 59.3905 28.1895 59.3905 26.6274 57.8284L1.1716 32.3726C-0.390497 30.8105 -0.390497 28.2778 1.1716 26.7157C2.7337 25.1536 5.26636 25.1536 6.82845 26.7157L29.4559 49.3431L52.0833 26.7157C53.6454 25.1536 56.178 25.1536 57.7401 26.7157C59.3022 28.2778 59.3022 30.8105 57.7401 32.3726L32.2843 57.8284ZM29.4559 0L33.4559 0V55H29.4559H25.4559L25.4559 0L29.4559 0Z"
      fill="white"
    />
    <animateTransform
      attributeName="transform"
      type="translate"
      values="0 0;0 -20;0 0"
      dur="2s"
      repeatCount="indefinite"
      additive="sum"
    />
  </svg>
</template>

<script setup lang="ts">
defineOptions({ name: 'ScrollIndicator' });

const TRANSLATE_MAP = {
  up: 'rotate(180)',
  down: 'rotate(0)',
};

const props = withDefaults(defineProps<{
  direction?: 'up' | 'down';
}>(), {
  direction: 'down',
});
</script>

<style lang="scss">
@use '~styles/utilities' as *;

.scroll-indicator {
  height: 24px;

  @include set-from-screen('xs') {
    height: 32px;
  }

  @include set-from-screen('l') {
    height: 55px;
  }
}
</style>
