import { appStore } from '@/core/stores/appStore';
import { Earth } from '@/components/Svg';

export const project = {
  name: 'Présentation',
  nameOverride: 'Portfolio',
  description: [
    'Il s\'agit de ce portfolio. Plus beau que le précedent et surtout plus animé !',
  ],
  link: 'https://matthieulepers.github.io/',
  medias: [],
  navigationSvg: Earth,
  navigationOnClick() {
    appStore.actions.scrollToScreen(0);
  },
  technologies: [
    { logo: '/img/svg/vuejs.svg', label: 'Vue.JS', tooltip: 'Vue 3' },
    { logo: '/img/svg/typescript.svg', label: 'TypeScript' },
    { logo: '/img/svg/sass.svg', label: 'SASS' },
    { logo: '/img/svg/vitejs.png', label: 'Vite' },
    { logo: '/img/svg/svg.svg', label: 'SVG' },
    { logo: '/img/svg/gsap.svg', label: 'GSAP', abbreviation: 'GreenSock Animation Platform', tooltip: 'Framework d\'animations' },
  ],
  deployment: [
    { logo: '/img/svg/github.svg', label: 'GitHub', tooltip: 'GitHub Pages via GitHub Actions' },
  ],
  tools: [
    { logo: '/img/svg/figma.svg', label: 'Figma' },
    { logo: '/img/svg/photoshop.svg', label: 'Photoshop', tooltip: 'Retouche du background' },
    { logo: '/img/svg/illustrator.svg', label: 'Illustrator', tooltip: 'Création d\'illustrations SVG' },
    { logo: '/img/svg/chatgpt.svg', label: 'ChatGPT', tooltip: 'Assitant technique' },
  ],
  order: 0,
};

export const achievements = {
  voyager_one: {
    name: 'Voyager 1',
    description: 'S\'éloignant de la Terre à une vitesse d\'environ 17 km/s, elle abrite un disque d\'or contenant diverses informations sur notre civilisation.',
    clue: 'L\'objet humain le plus lointain jamais envoyé dans l\'espace...',
    order: 0,
    image: '/img/achievements/icon-voyager-one.png',
  },
  '3i_atlas': {
    name: '3I/ATLAS',
    description: 'Une comète formée dans un autre système stellaire, passée dans notre système solaire fin 2025 et qui ne reviendra probablement jamais.',
    clue: 'Le 3e objet interstellaire découvert le 1er juillet 2025 au Chili...',
    order: 1,
    image: '/img/achievements/icon-3iatlas.png',
  },
};

// Usefull links :
// Free Online Photoshop   : https://www.photopea.com/
// Free Online Illustrator : https://www.vectorpea.com/
