export const project = {
  name: 'MCD Save Editor',
  description: 'Minecraft: Dungeons, sortie en mai 2020, offre une multitude de combinaisons de gameplay différents, et moi : un éditeur de sauvegarde 😈',
  link: '/mcd-save-editor/',
  github: 'https://github.com/MatthieuLepers/mcd-save-editor',
  image: '/img/mcd-save-editor.png',
  order: 2,
  details: {
    front: {
      main: ['Vue.js', 'Typescript'],
      bundler: ['vite', 'electron-builder'],
      eslint: ['Airbnb'],
      packages: [
        'vue-router',
        'vue-i18n',
        'axios',
        'sass',
        'electron',
      ],
    },
    back: {
      main: ['Electron', 'Node.js 22', 'Typescript'],
      bundler: ['tsc', 'electron-builder'],
      eslint: ['Airbnb'],
      packages: [
        'sequelize-typescript',
        'sqlite3',
        'yup',
      ],
    },
  },
};
