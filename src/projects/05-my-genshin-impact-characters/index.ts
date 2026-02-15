import { Saturn } from '@/components/Svg';
import { appStore } from '@/core/stores/appStore';

export const project = {
  name: {
    'fr-FR': 'My Genshin Impact Characters',
    'en-EN': 'My Genshin Impact Characters',
  },
  description: {
    'fr-FR': [
      'Étant un gros joueur Genshin Imapct, j’ai eu besoin d’une app pour la gestion de mes personnages.',
      'Cette app permet de savoir quoi farmer et dans quelle proportion selon nos propres objectifs en jeu.',
      'Cela peut être de la collecte de personnages, d’armes, d’artéfacts ou de l’optimisation de build de personnages.',
    ],
    'en-EN': [
      'As a big Genshin Impact player, I needed an app to manage my characters.',
      'This app lets you know what to farm and in what proportion according to your own in-game objectives.',
      'This can involve collecting characters, weapons, artifacts, or optimizing character builds.',
    ],
  },
  link: '/my-genshin-impact-characters/',
  github: 'https://github.com/MatthieuLepers/my-genshin-impact-characters',
  medias: [
    '/img/projects/my-genshin-impact-characters.png',
    '/img/projects/my-genshin-impact-characters-box.png',
    '/img/projects/my-genshin-impact-characters-artefacts.png',
    '/img/projects/my-genshin-impact-characters-weapons.png',
    '/img/projects/my-genshin-impact-characters-builds.png',
    '/img/projects/my-genshin-impact-characters-builds-details.png',
  ],
  navigationSvg: Saturn,
  navigationOnClick() {
    appStore.actions.scrollToScreen(5);
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
    {
      logo: '/img/svg/nodejs.svg',
      label: 'Node.JS',
      tooltip: {
        'fr-FR': 'Node 22',
        'en-EN': 'Node 22',
      },
    },
    { logo: '/img/svg/electronjs.svg', label: 'Electron.JS' },
    { logo: '/img/svg/typescript.svg', label: 'TypeScript' },
    { logo: '/img/svg/sass.svg', label: 'SASS' },
    { logo: '/img/svg/vitejs.png', label: 'Vite' },
    { logo: '/img/svg/sequelize.svg', label: 'Sequelize' },
    { logo: '/img/svg/sqlite.svg', label: 'SQLite' },
    { logo: '/img/svg/json.png', label: 'JSON' },
  ],
  deployment: [
    {
      logo: '/img/svg/electronjs.svg',
      label: 'Electron.JS',
      tooltip: {
        'fr-FR': 'App standalone pour Windows, Linux et MacOS',
        'en-EN': 'Standalone app for Windows, Linux and macOS',
      },
    },
    {
      logo: '/img/svg/github.svg',
      label: 'GitHub',
      tooltip: {
        'fr-FR': 'GitHub Pages via GitHub Actions',
        'en-EN': 'GitHub Pages using GitHub Actions',
      },
    },
  ],
  order: 5,
};
