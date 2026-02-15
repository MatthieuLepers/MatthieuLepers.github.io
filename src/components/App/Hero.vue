<template>
  <section class="app-hero screen">
    <Container class="app-hero__container flexy">
      <div class="app-hero__left flexy__col flexy__col--full flexy__col--1of2@from-m">
        <h1 class="app-hero__title">
          <span>
            Bonjour<span>.</span><br />
            Moi c’est Matthieu
          </span>

          Développeur JavaScript
        </h1>

        <div class="app-hero__actions">
          <a
            href="https://calendly.com/matthieu-lepers/prise-de-contact"
            target="_blank"
            class="cta cta--filled"
          >
            Vous avez un projet ?
          </a>
        </div>
      </div>

      <div class="app-hero__right flexy__col flexy__col--full flexy__col--1of2@from-m">
        <img src="/img/Profile.png" alt="Photo de profil de Matthieu LEPERS" />

        <div class="app-hero__about">
          <h2>À propos de moi...</h2>
          <p>
            J’ai découvert la programmation au lycée via ma calculatrice TI,<br />
            par la suite je me suis spécialisé dans le développement web.
          </p>
        </div>

        <div class="app-hero__numbers flexy flexy--gutter">
          <div class="number flexy__col flexy__col--1of3 flexy__col--1of2@from-s flexy__col--1of3@from-l">
            <h4>
              8<span>+</span>
            </h4>
            <p>
              Années<br />
              d'expérience
            </p>
          </div>
          <div class="number flexy__col flexy__col--1of3 flexy__col--1of3 flexy__col--1of2@from-s flexy__col--1of3@from-l">
            <h4>4</h4>
            <p>
              Missions<br />
              longues réalisées
            </p>
          </div>
        </div>
      </div>

      <button
        class="app-hero__scroll-button"
        title="Voir mes derniers projets personnels"
        @click="appStore.actions.scrollToScreen(1)"
      >
        <ScrollIndicator />
      </button>
    </Container>
  </section>
</template>

<script setup lang="ts">
import ScrollIndicator from '@/components/Svg/ScrollIndicator.vue';
import Container from '@/components/Container.vue';

import { appStore } from '@/core/stores/appStore';

defineOptions({ name: 'AppHero' });
</script>

<style lang="scss" src="./Hero.scss">
</style>
