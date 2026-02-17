import { markRaw } from 'vue';

import { appStore } from '@/core/stores/appStore';
import { Uranus } from '@/components/Svg';
import Scene from './Scene.vue';

export const project = {
  name: {
    'fr-FR': 'Gravity Simulation',
    'en-EN': 'Gravity Simulation',
  },
  description: {
    'fr-FR': [
      'Simulation gravitationnelle N-corps développée avec WebGPU, exploitant le calcul massivement parallèle côté navigateur.',
      'Implémentation optimisée pour gérer jusqu’à 10 millions de particules : gestion mémoire, représentation des champs et performance à grande échelle.',
      'Démonstration technique des capacités GPU modernes appliquées à la simulation physique temps réel.',
      'Vous pouvez essayer la version 2D dans le carrousel.',
    ].join('\n'),
    'en-EN': [
      'N-body gravitational simulation built with WebGPU, leveraging massively parallel computation in the browser.',
      'Optimized implementation capable of handling up to 10 million particles: memory management, field representation and large-scale performance.',
      'Technical demonstration of modern GPU capabilities applied to real-time physical simulation.',
      'You can try the 2D version in the slider.',
    ].join('\n'),
  },
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
    appStore.actions.scrollToScreen(4, 'navigation');
  },
  technologies: [
    { logo: '/img/svg/webgpu.svg', label: 'WebGPU' },
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
  tools: [
    {
      logo: '/img/svg/chatgpt.svg',
      label: 'ChatGPT',
      tooltip: {
        'fr-FR': 'Montée en compétence WebGPU & Assistant technique',
        'en-EN': 'WebGPU Skills Development & Technical Support',
      },
    },
  ],
  order: 4,
};

export const achievements = {
  red_dwarf: {
    name: {
      'fr-FR': 'Naine rouge',
      'en-EN': 'Red dwarf',
    },
    description: {
      'fr-FR': 'Vous avez vu naître une petite étoile de la catégorie des naines rouges !',
      'en-EN': 'You have witnessed the birth of a little star in the red dwarf category!',
    },
    order: 0,
    clue: {
      'fr-FR': 'Patience, la graviter travaille...',
      'en-EN': 'Patience, gravity is slowly working...',
    },
    image: '/img/achievements/icon-red.png',
  },
  yellow_dwarf: {
    name: {
      'fr-FR': 'Naine jaune',
      'en-EN': 'Yellow dwarf',
    },
    description: {
      'fr-FR': 'Vous avez vu naître une étoile de la catégorie des naines jaunes, comme notre Soleil !',
      'en-EN': 'You have witnessed the birth of a star in the yellow dwarf category, like our Sun!',
    },
    order: 1,
    clue: {
      'fr-FR': 'Celle-ci semble plus rare...',
      'en-EN': 'This one seems to be rarer...',
    },
    image: '/img/achievements/icon-yellow.png',
  },
  black_hole: {
    name: {
      'fr-FR': 'Trou noir',
      'en-EN': 'Black Hole',
    },
    description: {
      'fr-FR': 'C’est le destin des étoiles trop massives.',
      'en-EN': 'That’s the fate of stars that are too massive.',
    },
    order: 2,
    clue: {
      'fr-FR': 'La gravité l’emporte',
      'en-EN': 'Gravity prevails',
    },
    image: '/img/achievements/icon-black_hole.png',
  },
  gargantua: {
    name: {
      'fr-FR': 'Gargantua',
      'en-EN': 'Gargantua',
    },
    description: {
      'fr-FR': 'Il semblerai que vous ayez vu Interstellar',
      'en-EN': 'It seems you’ve seen Interstellar',
    },
    order: 3,
    clue: {
      'fr-FR': '???',
      'en-EN': '???',
    },
    image: '/img/achievements/icon-black_hole.png',
    hidden: true,
  },
};
