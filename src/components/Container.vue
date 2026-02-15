<template>
  <component class="container" :is="props.is">
    <slot />
  </component>
</template>

<script setup lang="ts">
defineSlots<{
  default(): void;
}>();

const props = withDefaults(defineProps<{
  is?: string;
}>(), {
  is: 'div',
});
</script>

<style lang="scss">
@use '~styles/utilities' as *;

.container {
  width: calc(100% - 24px);
  margin: 0 auto;

  @include set-from-screen('s') {
    width: 660px;
  }

  @include set-from-screen('m') {
    width: 980px;
  }

  @include set-from-screen('l') {
    width: calc(100% - 120px);
  }

  @include set-from-screen('xl') {
    width: calc(100% - 120px);
  }

  @include set-from-screen('xxl') {
    width: 100%;
    max-width: 1920px;
  }
}
</style>
