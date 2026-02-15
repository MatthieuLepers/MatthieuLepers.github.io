import { markRaw } from 'vue';

import { appStore } from '@/core/stores/appStore';
import { Planet2 } from '@/components/Svg';
import Scene from './Scene.vue';

export const project = {
  name: 'R-Type Web V2',
  description: [
    'Grandement inspiré du jeu du même nom de chez IREM, sortie en 1987. Initialement calculé en position: absolute, je suis ensuite passé sur un canvas HTML.',
    'Tout est fait main : le moteur graphique, le moteur physique, la gestion des projectiles, etc...',
    'Ce projet me tiens depuis ma 2nde année de FAC, soit en 2015, et à été extrêmement formateur dans l\'apprentissage du JavaScript ainsi que sur la programmation orientée objet.',
  ],
  link: '/r-type-web-v2/',
  scene: markRaw(Scene),
  medias: [
    '/img/projects/r-type-web-v2-charged-shot.png',
    '/img/projects/r-type-web-v2-wave-5.png',
    '/img/projects/r-type-web-v2-module-side.png',
    '/img/projects/r-type-web-v2-forcefield.png',
    '/img/projects/r-type-web-v2-module-side.png',
    '/img/projects/r-type-web-v2-difficulty.png',
    '/img/projects/r-type-web-v2-final-boss.png',
    '/img/projects/r-type-web-v2-final-boss-pattern.png',
  ],
  navigationSvg: Planet2,
  navigationOnClick() {
    appStore.actions.scrollToScreen(1);
  },
  technologies: [
    { logo: '/img/svg/vuejs.svg', label: 'Vue.JS', tooltip: 'Vue 3' },
    { logo: '/img/svg/typescript.svg', label: 'TypeScript' },
    { logo: '/img/svg/sass.svg', label: 'SASS' },
    { logo: '/img/svg/vitejs.png', label: 'Vite' },
  ],
  deployment: [
    { logo: '/img/svg/github.svg', label: 'GitHub', tooltip: 'GitHub Pages via GitHub Actions' },
  ],
  order: 1,
};
