import { appStore } from '@/core/stores/appStore';
import { Saturn } from '@/components/Svg';

export const project = {
  name: 'MCD Save Editor',
  description: [
    'Minecraft: Dungeons, sortie en mai 2020, offre une multitude de combinaisons de gameplay différents, mais avec un énorme défaut : le farming. Les équipement sont générés aléatoirement et obtenir les bons perks sur les bonnes armes ou armures peut prendre beaucoup de temps.',
    'C\'est là qu\'interviens cet éditeur de sauvegarde 😈',
    'Il est disponible en format app téléchargeable ou en version WebApp, un tutoriel inclus permet d\'apprendre à l\'utiliser.',
  ],
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
    { logo: '/img/svg/vuejs.svg', label: 'Vue.JS', tooltip: 'Vue 3' },
    { logo: '/img/svg/nodejs.svg', label: 'Node.JS', tooltip: 'Node 22' },
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
    { logo: '/img/svg/electronjs.svg', label: 'Electron.JS', tooltip: 'App standalone pour Windows' },
    { logo: '/img/svg/github.svg', label: 'GitHub', tooltip: 'GitHub Pages via GitHub Actions' },
  ],
  tools: [
    { logo: '/img/svg/illustrator.svg', label: 'Illustrator', tooltip: 'Création et retouche d\'icônes' },
  ],
  order: 3,
};
