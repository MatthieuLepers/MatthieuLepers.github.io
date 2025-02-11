<template>
  <div class="container">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineSlots<{
  default(): void;
}>();
</script>

<style lang="scss">
@import '~styles/utilities';

.container {
  width: calc(100% - 32px);
  margin: 0 auto;

  @include set-from-screen(s) {
    width: 660px;
  }

  @include set-from-screen(m) {
    width: 980px;
  }

  @include set-from-screen(l) {
    width: 1024px;
  }

  @include set-from-screen(xl) {
    width: 1200px;
  }
}
</style>
