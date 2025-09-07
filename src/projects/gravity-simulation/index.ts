import Scene from './Scene.vue';

export const project = {
  name: 'Gravity simulation',
  description: 'Passionné d\'astronomie, j\'ai toujours rêvé de voir la naissance d\'une étoile... Optimisé avec WebGPU.',
  link: '/gravity-simulation',
  scene: Scene,
  github: 'https://github.com/MatthieuLepers/gravity-simulation',
  order: 1,
};

export const achievements = {
  red_dwarf: {
    name: 'Naine rouge',
    description: 'Vous avez vu naître une petite étoile de la catégorie des naines rouges !',
    order: 0,
    clue: 'Patience, la graviter travaille...',
    project: 'Gravity simulation',
    image: '/img/achievements/icon-red.png',
  },
  yellow_dwarf: {
    name: 'Naine jaune',
    description: 'Vous avez vu naître une étoile de la catégorie des naines jaunes, comme notre Soleil !',
    order: 1,
    clue: 'Celle-ci semble bien plus rare...',
    project: 'Gravity simulation',
    image: '/img/achievements/icon-yellow.png',
  },
  black_hole: {
    name: 'Trou noir',
    description: "C'est le destin des étoiles trop massives.",
    order: 2,
    clue: 'Trop dense et trop massif.',
    project: 'Gravity simulation',
    image: '/img/achievements/icon-black_hole.png',
  },
  gargantua: {
    name: 'Gargantua',
    description: 'Vous avez vu Interstellar ?',
    order: 3,
    clue: '???',
    project: 'Gravity simulation',
    image: '/img/achievements/icon-black_hole.png',
    hidden: true,
  },
};
