import { appStore } from '@/core/stores/appStore';
import { Saturn } from '@/components/Svg';

export const project = {
  name: {
    'fr-FR': 'MCD Save Editor',
    'en-EN': 'MCD Save Editor',
  },
  description: {
    'fr-FR': [
      'Minecraft: Dungeons, sortie en mai 2020, offre une multitude de combinaisons de gameplay différents, mais avec un énorme défaut : le farming. Les équipement sont générés aléatoirement et obtenir les bons perks sur les bonnes armes ou armures peut prendre beaucoup de temps.',
      'C’est là qu’interviens cet éditeur de sauvegarde 😈',
      'Il est disponible en format app téléchargeable ou en version WebApp, un tutoriel inclus permet d’apprendre à l’utiliser.',
    ],
    'en-EN': [
      'Minecraft: Dungeons, released in May 2020, offers a multitude of different gameplay combinations, but with one major flaw: grinding. Equipment is randomly generated, and obtaining the right perks on the right weapons or armor can be very time-consuming.',
      'That’s where this backup editor comes in 😈',
      'It is available as a downloadable app or as a WebApp, and includes a tutorial to help you learn how to use it.',
    ],
  },
  link: '/mcd-save-editor/',
  github: 'https://github.com/MatthieuLepers/mcd-save-editor',
  medias: [
    '/img/projects/mcd-save-editor.png',
    '/img/projects/mcd-save-editor-item-selector.png',
    '/img/projects/mcd-save-editor-enchantment.png',
    '/img/projects/mcd-save-editor-storage-chest.png',
    '/img/projects/mcd-save-editor-ancien-hunt.png',
    '/img/projects/mcd-save-editor-tutorial.png',
  ],
  navigationSvg: Saturn,
  navigationOnClick() {
    appStore.actions.scrollToScreen(3);
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
    { logo: '/img/svg/typescript.svg', label: 'TypeScript' },
    { logo: '/img/svg/electronjs.svg', label: 'Electron.JS' },
    { logo: '/img/svg/sass.svg', label: 'SASS' },
    { logo: '/img/svg/vitejs.png', label: 'Vite' },
    { logo: '/img/svg/sequelize.svg', label: 'Sequelize' },
    { logo: '/img/svg/sqlite.svg', label: 'SQLite' },
    { logo: '/img/svg/json.png', label: 'JSON' },
    { logo: '/img/svg/svg.svg', label: 'SVG', abbreviation: 'Scalable Vector Graphics' },
  ],
  deployment: [
    {
      logo: '/img/svg/electronjs.svg',
      label: 'Electron.JS',
      tooltip: {
        'fr-FR': 'App standalone pour Windows',
        'en-EN': 'Standalone app for Windows',
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
  tools: [
    {
      logo: '/img/svg/illustrator.svg',
      label: 'Illustrator',
      tooltip: {
        'fr-FR': 'Création et retouche d’icônes',
        'en-EN': 'Icon creation and editing',
      },
    },
  ],
  order: 3,
};
