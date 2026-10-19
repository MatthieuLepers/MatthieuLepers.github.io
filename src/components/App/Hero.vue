<template>
  <section class="app-hero screen">
    <Container class="app-hero__container flexy">
      <div class="app-hero__left flexy__col flexy__col--full flexy__col--1of2@from-m">
        <h1 class="app-hero__title">
          <span>
            {{ t('Hero.hello') }}<span>.</span><br />
            {{ t('Hero.iam') }}
          </span>

          {{ t('Hero.jobName') }}
        </h1>

        <div class="app-hero__actions">
          <a
            href="https://calendly.com/matthieu-lepers/prise-de-contact"
            target="_blank"
            class="cta cta--filled"
            @click="analyticsStore.actions.onClickCTA({
              type: 'calendly',
            })"
          >
            {{ t('Hero.youGetAProject') }}
          </a>
        </div>
      </div>

      <div class="app-hero__right flexy__col flexy__col--full flexy__col--1of2@from-m">
        <img src="/img/Profile.png" alt="Photo de profil de Matthieu LEPERS" />

        <div class="app-hero__about">
          <h2>{{ t('Hero.aboutMe') }}</h2>
          <p>
            {{ t('Hero.aboutMeParagraph') }}
          </p>
        </div>

        <div class="app-hero__numbers flexy flexy--gutter">
          <div class="number flexy__col flexy__col--1of3 flexy__col--1of2@from-s flexy__col--1of3@from-l">
            <h4>
              {{ years }}<span>+</span>
            </h4>
            <p>
              {{ t('Hero.numbers.yearOfExperiences') }}
            </p>
          </div>
          <div class="number flexy__col flexy__col--1of3 flexy__col--1of3 flexy__col--1of2@from-s flexy__col--1of3@from-l">
            <h4>4</h4>
            <p>
              {{ t('Hero.numbers.accomplishedMissions') }}
            </p>
          </div>
        </div>
      </div>

      <button
        class="app-hero__scroll-button"
        title="Voir mes derniers projets personnels"
        @click="appStore.actions.scrollToScreen(1, 'hero_arrow_down')"
      >
        <ScrollIndicator />
      </button>
    </Container>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Container from '@/components/Container.vue';
import ScrollIndicator from '@/components/Svg/ScrollIndicator.vue';

import { analyticsStore } from '@/core/analytics/store';
import { appStore } from '@/core/stores/appStore';

defineOptions({ name: 'AppHero' });

const { t } = useI18n();

const years = computed(() => {
  const origineDate = new Date('2017-10-20');
  const now = new Date();

  let years = now.getFullYear() - origineDate.getFullYear();

  const anniversaryNotReached =
    now.getMonth() < origineDate.getMonth()
    || (now.getMonth() === origineDate.getMonth() && now.getDate() < origineDate.getDate())
  ;

  if (anniversaryNotReached) {
    years--;
  }

  return years;
});
</script>

<style lang="scss" src="./Hero.scss">
</style>
