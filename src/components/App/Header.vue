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
          :title="t('Header.myProfilOnLinkedIn')"
          @click="analyticsStore.actions.onSocialCTAClick({
            type: 'profil_linkedin',
          })"
        >
          <img src="/img/linkedin.svg" alt="" />
        </a>
        <a
          href="https://www.malt.fr/profile/matthieulepers"
          target="_blank"
          :title="t('Header.myProfilOnMalt')"
          @click="analyticsStore.actions.onSocialCTAClick({
            type: 'profil_malt',
          })"
        >
          <img src="/img/malt.svg" alt="" />
        </a>
        <a
          href="https://github.com/MatthieuLepers"
          target="_blank"
          :title="t('Header.myProfilOnGitHub')"
          @click="analyticsStore.actions.onSocialCTAClick({
            type: 'profil_github',
          })"
        >
          <img src="/img/github.svg" alt="" />
        </a>
        <button
          class="app-header__lang"
          v-for="(iso, i) in filteredLocale"
          :key="i"
          :title="t(`iso.${iso}`)"
          @click="actions.handleChangeLocale(iso)"
        >
          <img :src="`/img/i18n/${iso}.svg`" alt="" />
        </button>
      </div>
    </Container>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute,useRouter } from 'vue-router';

import Container from '@/components/Container.vue';

import { analyticsStore } from '@/core/analytics/store';
import { appStore } from '@/core/stores/appStore';

defineOptions({ name: 'AppHeader' });

const { t, locale, availableLocales } = useI18n();
const router = useRouter();
const route = useRoute();

const filteredLocale = computed(() => availableLocales.filter((l) => l !== locale.value));

const actions = {
  handleChangeLocale(iso: string) {
    locale.value = iso;
    router.replace({
      name: route.name,
      params: route.params,
      query: {
        lang: iso,
      },
    });
    analyticsStore.actions.onI18nCTAClick({
      type: 'i18n',
      lang: iso,
    });
  },
};

onBeforeMount(() => {
  const { lang } = route.query;

  if (lang && availableLocales.includes(lang.toString())) {
    actions.handleChangeLocale(lang.toString());
  }
});
</script>

<style lang="scss" src="./Header.scss">
</style>
