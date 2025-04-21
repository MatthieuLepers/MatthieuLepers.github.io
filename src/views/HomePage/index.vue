<template>
  <main :class="GenerateModifiers('home-view', { story: appStore.state.storyMode })">
    <MaterialFormToggle
      v-model="appStore.state.storyMode"
      label="Story mode"
      class="btn-story-mode"
    />

    <div class="baseline">
      <Container>
        <h1>Bienvenue sur<br />mon Portfolio</h1>
        <p>
          Je suis un développeur web passionné depuis avril 2017. Curieux et toujours à l'affût des nouvelles technologies, j'aime concevoir des applications performantes, intuitives et bien structurées. Mon objectif : allier technique et expérience utilisateur pour créer des solutions efficaces et adaptées aux besoins.
        </p>
      </Container>
    </div>

    <Container>
      <Carousel
        :itemsToShow="1"
        :transition="500"
        :wrapAround="true"
        :gap="16"
        :breakpoints="{
          564: {
            itemsToShow: appStore.state.storyMode ? 1 : 2,
          },
          1024: {
            itemsToShow: appStore.state.storyMode ? 1 : 3,
          },
        }"
        snapAlign="start"
        class="carousel"
      >
        <Slide v-for="(project, i) in projects" :key="i">
          <ProjectCard :project="project" />
        </Slide>

        <template #addons v-if="!appStore.state.storyMode">
          <Pagination />
        </template>
      </Carousel>
    </Container>
  </main>
</template>

<script setup>
import { reactive, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Carousel, Slide, Pagination } from 'vue3-carousel';
import 'vue3-carousel/carousel.css';

import MaterialFormToggle from '@/components/Materials/Form/Toggle.vue';
import Container from '@/components/Container.vue';
import ProjectCard from '@/components/Project/Card.vue';
import RTypeWebScene from '@/components/Scenes/RTypeWeb.vue';
import GravitySimulationScene from '@/components/Scenes/GravitySimulationScene.vue';

import { appStore } from '@/core/stores/appStore';

defineOptions({ name: 'HomePage' });

const route = useRoute();

const state = reactive({
  currentSlideIndex: 0,
});

const projects = [
  {
    name: 'R-Type Web V2',
    description: 'Grandement inspiré du jeu du même nom de chez IREM, sortie en 1987. Ce projet me tiens depuis 2015 et ceci est la version 2.',
    link: '/r-type-web-v2/',
    scene: RTypeWebScene,
  },
  {
    name: 'Gravity simulation',
    description: 'Passionné d\'astronomie, j\'ai toujours rêvé de voir la naissance d\'une étoile... Optimisé avec WebGPU.',
    link: '/gravity-simulation',
    scene: GravitySimulationScene,
    github: 'https://github.com/MatthieuLepers/gravity-simulation',
  },
  {
    name: 'MCD Save Editor',
    description: 'Minecraft: Dungeons, sortie en mai 2020, offre une multitude de combinaisons de gameplay différents, et moi : un éditeur de sauvegarde 😈',
    link: '/mcd-save-editor/',
    github: 'https://github.com/MatthieuLepers/mcd-save-editor',
    image: '/img/mcd-save-editor.png',
  },
  {
    name: 'My Genshin Impact characters',
    description: 'Un outil de tracking pour Genshin Impact, permettant de savoir quoi farmer et dans quelle proportion selon nos propres objectifs en jeu.',
    link: '/my-genshin-impact-characters/',
    github: 'https://github.com/MatthieuLepers/my-genshin-impact-characters',
    image: '/img/my-genshin-impact-characters.png',
  },
];

watch(() => route.hash, (hash) => {
  state.currentSlideIndex = parseInt(hash.replace(/#slide([0-9]+)/, '$1'), 10);
});

onBeforeMount(() => {
  const hash = route.hash.length ? route.hash : '#slide0';
  state.currentSlideIndex = parseInt(hash.replace(/#slide([0-9]+)/, '$1'), 10);
});
</script>

<style lang="scss" src="./index.scss">
</style>
