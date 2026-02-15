<template>
  <section class="app-project screen">
    <slot name="prev" />

    <div class="app-project__content">
      <Carousel
        :itemsToShow="1"
        :transition="500"
        :wrapAround="true"
        :gap="16"
        :breakpoints="{
          564: {
            itemsToShow: 2,
          },
          1024: {
            itemsToShow: 3,
          },
          1600: {
            itemsToShow: 4,
          },
        }"
        snapAlign="start"
        class="carousel"
      >
        <Slide v-if="props.project.scene">
          <div class="carousel-slide">
            <component :is="props.project.scene" />
          </div>
        </Slide>
        <Slide v-for="(media, i) in sanityzedMedias" :key="i">
          <button class="carousel-slide" @click="emit('showMediaCarousel', props.project, i)">
            <img :src="media" alt="" v-if="media !== 0" />
          </button>
        </Slide>

        <template #addons>
          <Navigation />
          <Pagination :paginateByItemsToShow="true" />
        </template>
      </Carousel>

      <div class="app-project__infos">
        <h2 class="app-project__title">
          {{ props.project.name }}

          <div class="app-project__actions">
            <div
              v-if="achievementsStore.achivementsByProject.value?.[props.project.name]"
              class="app-project__achievements"
            >
              <span v-icon:trophy /> {{ achievementsStore.actions.countAcquiredByProject(props.project.name) }} / {{ Object.values(achievementsStore.achivementsByProject.value[props.project.name]).length }}
            </div>
            <a
              v-if="props.project.link"
              class="app-project__link"
              :href="props.project.link"
              target="_blank"
              :title="`Essayer ${props.project.name}`"
            >
              <span v-icon:play />
              Essayer
            </a>
            <a
              v-if="props.project.github"
              class="app-project__github"
              :href="props.project.github"
              target="_blank"
              :title="`Voir le projet ${props.project.name} sur GitHub`"
            >
              <span v-icon:github />
            </a>
          </div>
        </h2>
        <p
          v-for="(p, i) in props.project.description"
          :key="i"
          class="app-project__description"
        >
          {{ p }}
        </p>
      </div>

      <div class="app-project__infos flexy flexy--gutter">
        <div
          v-if="props.project.technologies"
          :class="{
            'app-project__technoblock': true,
            'flexy__col': true,
            'flexy__col--full': true,
            'flexy__col--full@from-xl': props.project.technologies.length > 4,
            'flexy__col--1of2@from-xl': props.project.technologies.length <= 4,
          }"
        >
          <h3>Technologies</h3>

          <AppTechnologieList
            :technologies="props.project.technologies"
            :perRow="props.project.technologies.length <= 4 ? 4 : 8"
          />
        </div>

        <div
          v-if="props.project.deployment"
          :class="{
            'app-project__technoblock': true,
            'flexy__col': true,
            'flexy__col--full': true,
            'flexy__col--1of2@from-s': true,
            'flexy__col--full@from-xl': (props.project.technologies?.length ?? 0) <= 4 && props.project.deployment.length > 4,
            'flexy__col--1of2@from-xl': (props.project.technologies?.length ?? 0) > 4 && props.project.deployment.length <= 4,
          }"
        >
          <h3>Déploiement</h3>

          <AppTechnologieList
            :technologies="props.project.deployment"
            :perRow="4"
          />
        </div>

        <div
          v-if="props.project.tools"
          :class="{
            'app-project__technoblock': true,
            'flexy__col': true,
            'flexy__col--full': true,
            'flexy__col--1of2@from-s': true,
            'flexy__col--full@from-xl': (props.project.technologies?.length ?? 0) <= 4 && props.project.tools.length > 4,
            'flexy__col--1of2@from-xl': (props.project.technologies?.length ?? 0) > 4  && props.project.tools.length <= 4,
          }"
        >
          <h3>Outils</h3>

          <AppTechnologieList
            :technologies="props.project.tools"
            :perRow="4"
          />
        </div>
      </div>
    </div>

    <slot name="next" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Carousel,
  Slide,
  Pagination,
  Navigation,
} from 'vue3-carousel';
import 'vue3-carousel/carousel.css';

import AppTechnologieList from '@/components/App/TechnologieList.vue';

import type { IProject } from '@/projects';
import { achievementsStore } from '@/core/entities/achievement/store';

defineOptions({ name: 'AppProject' });

defineSlots<{
  prev(): void;
  next(): void;
}>();

const emit = defineEmits<{
  showMediaCarousel: [project: IProject, mediaIndex: number];
}>();

const props = defineProps<{
  project: IProject;
}>();

const SLIDER_TEST = 4;
const sanityzedMedias = computed<Array<string | 0>>(() => {
  if (!Array.isArray(props.project.medias)) return [0, 0, 0, 0];

  if (props.project.medias.length >= SLIDER_TEST) return props.project.medias;

  if (props.project.medias.length < SLIDER_TEST && !props.project.scene) {
    return [
      ...props.project.medias,
      ...Array(SLIDER_TEST - props.project.medias.length).fill(0),
    ];
  }
  return [
    ...props.project.medias,
    ...Array(SLIDER_TEST - (props.project.medias.length - 1)).fill(0),
  ];
});
</script>

<style lang="scss" src="./Project.scss">
</style>
