import { markRaw } from 'vue';

import { appStore } from '@/core/stores/appStore';
import { Planet2 } from '@/components/Svg';
import Scene from './Scene.vue';

export const project = {
  name: {
    'fr-FR': 'R-Type Web V2',
    'en-EN': 'R-Type Web V2',
  },
  description: {
    'fr-FR': [
      'Recréation moderne d’un shoot’em up inspiré du classique d’IREM (1987), entièrement développé en JavaScript.',
      'Conception d’un moteur temps réel sur HTML Canvas : rendu graphique, moteur physique, gestion des collisions et des projectiles.',
      'Architecture modulaire et évolutive, avec un focus particulier sur la performance et la structuration du code.',
    ].join('\n'),
    'en-EN': [
      'Modern reinterpretation of a classic shoot’em up inspired by IREM (1987), fully developed in JavaScript.',
      'Custom real-time engine built on HTML Canvas: rendering pipeline, physics engine, collision and projectile systems.',
      'Modular and scalable architecture with a strong focus on performance and code structure.',
    ].join('\n'),
  },
  link: '/r-type-web-v2/',
  github: 'https://github.com/MatthieuLepers/MatthieuLepers.github.io/tree/main/public/r-type-web-v2',
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
    {
      logo: '/img/svg/vuejs.svg',
      label: 'Vue.JS',
      tooltip: {
        'fr-FR': 'Vue 3',
        'en-EN': 'Vue 3',
      },
    },
    { logo: '/img/svg/typescript.svg', label: 'TypeScript' },
    { logo: '/img/svg/sass.svg', label: 'SASS' },
    { logo: '/img/svg/vitejs.png', label: 'Vite' },
  ],
  deployment: [
    {
      logo: '/img/svg/github.svg',
      label: 'GitHub',
      tooltip: {
        'fr-FR': 'GitHub Pages via GitHub Actions',
        'en-EN': 'GitHub Pages using GitHub Actions',
      },
    },
  ],
  order: 1,
};
