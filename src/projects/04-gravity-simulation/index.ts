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
      'Je suis un grand passionné d’astronomie et de physique des astres. Et j’ai toujours rêvé de voir naître une étoile, alors j’ai décidé de créer cette simulation gravitationnelle à N-corps.',
      'Gros défi technique car je voulais gérer 10 millions de particules élémentaires. Après quelques concession et des semaines de réflexion, de galère GPU et de recherche, j’ai mis en pause le projet, le resultat reste impressionnant.',
      'Pour les plus petites configurations, pensez à votre machine et ne poussez pas le curseur jusqu’aux 10 millions de particules.',
      'Une mini simulation 2D simpliste est dispo sur le carrousel.',
    ],
    'en-EN': [
      'I am a huge enthusiast of astronomy and celestial physics. And I’ve always dreamed of seeing a star born, so I decided to create this N-body gravitational simulation.',
      'A major technical challenge, as I wanted to manage 10 million elementary particles. After some compromises and weeks of reflection, GPU struggles and research, I paused the project; the result remains impressive.',
      'For smaller configurations, consider your machine and don’t push the slider up to 10 million particles.',
      'A simple 2D mini-simulation is available on the carousel.',
    ],
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
    appStore.actions.scrollToScreen(4);
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
