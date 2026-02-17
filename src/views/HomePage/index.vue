<template>
  <main class="home-view">
    <AppHeader />

    <AchivementMenu v-if="achievementsStore.actions.hasAnyAchievements()" />
    <AchievementArea />

    <AppHero />

    <AppNavigation />

    <AppProject
      v-for="(project, i) in projects"
      :key="i"
      :project="project"
      @showMediaCarousel="actions.handleShowMediaCarousel"
    >
      <template #prev>
        <button
          class="scroll-button scroll-button--up"
          :title="i === 0 ? t('Page.backToPresentation') : t('Page.previousProject')"
          @click="appStore.actions.scrollToScreen(appStore.state.currentIndex - 1, 'project_arrow_up')"
        >
          <ScrollIndicator direction="up" />
        </button>
      </template>
      <template #next v-if="projects?.[i + 1]">
        <button
          class="scroll-button scroll-button--down"
          :title="t('Page.nextProject')"
          @click="appStore.actions.scrollToScreen(appStore.state.currentIndex + 1, 'project_arrow_down')"
        >
          <ScrollIndicator direction="down" />
        </button>
      </template>
    </AppProject>

    <AppMediaCarousel
      :open="state.open"
      :current="state.currentMediaIndex"
      :medias="state.currentProject?.medias ?? []"
      @close="actions.handleCloseMediaCarousel"
    />
  </main>
</template>

<script setup lang="ts">
import { reactive, computed, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

import AppHeader from '@/components/App/Header.vue';
import AppHero from '@/components/App/Hero.vue';
import AppNavigation from '@/components/App/Navigation.vue';
import AppProject from '@/components/App/Project.vue';
import AppMediaCarousel from '@/components/App/MediaCarousel.vue';
import ScrollIndicator from '@/components/Svg/ScrollIndicator.vue';
import AchivementMenu from '@/components/Achievements/Menu.vue';
import AchievementArea from '@/components/Achievements/Area.vue';

import { appStore } from '@/core/stores/appStore';
import type { IProject } from '@/projects';
import { achievementsStore } from '@/core/entities/achievement/store';
import { analyticsStore } from '@/core/analytics/store';

defineOptions({ name: 'HomePage' });

const { t } = useI18n();

const state = reactive<{
  open: boolean;
  currentProject: IProject | null;
  currentMediaIndex: number;
}>({
  open: false,
  currentProject: null,
  currentMediaIndex: 0,
});

const projects = computed(() => appStore.state.projects.slice(1));

const actions = {
  handleShowMediaCarousel(project: IProject, mediaIndex: number) {
    state.open = true;
    state.currentProject = project;
    state.currentMediaIndex = mediaIndex;
  },
  handleCloseMediaCarousel() {
    state.open = false;
    state.currentMediaIndex = 0;
  },
};

onBeforeMount(() => {
  analyticsStore.actions.onLand();
  analyticsStore.actions.onEnterSection({
    type: 'hero',
  });
});
</script>

<style lang="scss" src="./index.scss">
</style>
