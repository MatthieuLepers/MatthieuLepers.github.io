<template>
  <header :class="GenerateModifiers('app-header', {
    small: appStore.state.currentIndex > 0,
  })">
    <Container class="app-header__container">
      <span class="app-header__title">
        Matthieu LEPERS
      </span>

      <div class="app-header__social">
        <a
          href="https://www.linkedin.com/in/matthieu-lepers/"
          target="_blank"
          title="Consulter mon profil LinkedIn"
        >
          <img src="/img/linkedin.svg" alt="" />
        </a>
        <a
          href="https://www.malt.fr/profile/matthieulepers"
          target="_blank"
          title="Consulter mon profil Malt"
        >
          <img src="/img/malt.svg" alt="" />
        </a>
        <a
          href="https://github.com/MatthieuLepers"
          target="_blank"
          title="Consulter mon GitHub"
        >
          <img src="/img/github.svg" alt="" />
        </a>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import Container from '@/components/Container.vue';

import { appStore } from '@/core/stores/appStore';

defineOptions({ name: 'AppHeader' });
</script>

<style lang="scss" src="./Header.scss">
</style>
