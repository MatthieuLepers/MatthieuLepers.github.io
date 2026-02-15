import { markRaw } from 'vue';

import { appStore } from '@/core/stores/appStore';
import { Uranus } from '@/components/Svg';
import Scene from './Scene.vue';

export const project = {
  name: 'Gravity Simulation',
  description: [
    'Je suis un grand passionné d\'astronomie et de physique des astres.',
    'Et j\'ai toujours rêvé de voir naître une étoile, alors j\'ai décidé de créer cette simulation gravitationnelle à N-corps.',
    'Gros défi technique car je voulais gérer 10 millions de particules élémentaires. Après quelques concession et des semaines de réflexion, de galère GPU et de recherche, j\'ai mis en pause le projet, le resultat reste impressionnant.',
    'Pour les plus petites configurations, pensez à votre machine et ne poussez pas le curseur jusqu\'aux 10 millions de particules.',
    'Une mini simulation 2D simpliste est dispo sur le carrousel.',
  ],
  link: '/gravity-simulation',
  scene: markRaw(Scene),
  github: 'https://github.com/MatthieuLepers/gravity-simulation',
  medias: [
    '/img/projects/gravity-simulation.png',
    '/img/projects/gravity-simulation-gaussian.png',
    '/img/projects/gravity-simulation-gaussian-disc.png',
    '/img/projects/gravity-simulation-gaussian-disc-max.png',
  ],
  navigationSvg: Uranus,
  navigationOnClick() {
    appStore.actions.scrollToScreen(4);
  },
  technologies: [
    { logo: '/img/svg/webgpu.svg', label: 'WebGPU' },
    { logo: '/img/svg/typescript.svg', label: 'TypeScript' },
    { logo: '/img/svg/sass.svg', label: 'SASS' },
    { logo: '/img/svg/vitejs.png', label: 'Vite' },
  ],
  deployment: [
    { logo: '/img/svg/github.svg', label: 'GitHub', tooltip: 'GitHub Pages via GitHub Actions' },
  ],
  tools: [
    { logo: '/img/svg/chatgpt.svg', label: 'ChatGPT', tooltip: 'Montée en compétence WebGPU & Assistant technique' },
  ],
  order: 4,
};

export const achievements = {
  red_dwarf: {
    name: 'Naine rouge',
    description: 'Vous avez vu naître une petite étoile de la catégorie des naines rouges !',
    order: 0,
    clue: 'Patience, la graviter travaille...',
    image: '/img/achievements/icon-red.png',
  },
  yellow_dwarf: {
    name: 'Naine jaune',
    description: 'Vous avez vu naître une étoile de la catégorie des naines jaunes, comme notre Soleil !',
    order: 1,
    clue: 'Celle-ci semble bien plus rare...',
    image: '/img/achievements/icon-yellow.png',
  },
  black_hole: {
    name: 'Trou noir',
    description: "C'est le destin des étoiles trop massives.",
    order: 2,
    clue: 'Trop dense et trop massif.',
    image: '/img/achievements/icon-black_hole.png',
  },
  gargantua: {
    name: 'Gargantua',
    description: 'Vous avez vu Interstellar ?',
    order: 3,
    clue: '???',
    image: '/img/achievements/icon-black_hole.png',
    hidden: true,
  },
};
