export const project = {
  name: 'My Genshin Impact characters',
  description: 'Un outil de tracking pour Genshin Impact, permettant de savoir quoi farmer et dans quelle proportion selon nos propres objectifs en jeu.',
  link: '/my-genshin-impact-characters/',
  github: 'https://github.com/MatthieuLepers/my-genshin-impact-characters',
  image: '/img/my-genshin-impact-characters.png',
  order: 3,
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
