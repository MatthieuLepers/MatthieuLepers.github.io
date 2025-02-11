<template>
  <div class="scene scene--r-type-web">
    <img src="/img/blue.png" alt="" class="ship" />
    <img src="/img/r-type-web.gif" alt="" class="module" />
  </div>
</template>

<script setup>
</script>

<style lang="scss">
@import './Scene';

@keyframes backgroundScroll {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -600px 0;
  }
}

.scene--r-type-web {
  background-image: url('/img/background.png');
  background-repeat: repeat-x;
  animation: backgroundScroll 10s linear infinite;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;

  img {
    width: auto;
  }
}
</style>
