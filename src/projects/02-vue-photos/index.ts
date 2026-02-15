import { appStore } from '@/core/stores/appStore';
import { Jupiter } from '@/components/Svg';

export const project = {
  name: 'GED Multimédia',
  description: [
    'Une plateforme multimédia perso inspirée de Google Photos et auto-hébergé sur mon raspberry pi. C\'est un de mes plus gros projet, il mêle front, back for front avec API REST, stockage de fichier, cybersécurité, gestion d\'archi et d\'infra, optimisation...',
    'Une version de démo est accéssible pour les plus curieux.',
  ],
  link: 'https://ged.cosmicnoise.dev/#/request-demo-account',
  medias: [
    '/img/projects/ged-login.png',
    '/img/projects/ged-photos.png',
    '/img/projects/ged-albums.png',
    '/img/projects/ged-videos.png',
    '/img/projects/ged-playlists.png',
  ],
  navigationSvg: Jupiter,
  navigationOnClick() {
    appStore.actions.scrollToScreen(2);
  },
  technologies: [
    { logo: '/img/svg/vuejs.svg', label: 'Vue.JS', tooltip: 'Vue 3' },
    { logo: '/img/svg/typescript.svg', label: 'TypeScript' },
    { logo: '/img/svg/sass.svg', label: 'SASS' },
    { logo: '/img/svg/nodejs.svg', label: 'Node.JS', tooltip: 'Node 22' },
    { logo: '/img/svg/nestjs.svg', label: 'NestJS' },
    { logo: '/img/svg/gcp.svg', label: 'Google Cloud', tooltip: 'OAuth et ReCaptcha' },
    { logo: '/img/svg/vitejs.png', label: 'Vite' },
    { logo: '/img/svg/sequelize.svg', label: 'Sequelize' },
    { logo: '/img/svg/mysql.svg', label: 'MySQL' },
    { logo: '/img/svg/socket.io.svg', label: 'Socket.IO' },
    { logo: '/img/svg/tus-protocol.svg', label: 'TUS Protocol', tooltip: 'Upload de fichiers volumineux par chunks' },
    { logo: '/img/svg/uppy.svg', label: 'Uppy' },
    { logo: '/img/svg/redis.svg', label: 'Redis', tooltip: 'Gestion de queues avec bull' },
    { logo: '/img/svg/puppeteer.svg', label: 'Puppeteer', tooltip: 'Fallback pour le téléchargmement via URL' },
    { logo: '/img/svg/ffmpeg.svg', label: 'ffmpeg', tooltip: 'Génération de miniatures et convertion vidéos' },
    { logo: '/img/svg/svg.svg', label: 'SVG', abbreviation: 'Scalable Vector Graphics' },
    { logo: '/img/svg/mjml.svg', label: 'MJML', tooltip: 'Création emailings' },
  ],
  deployment: [
    { logo: '/img/svg/raspberry-pi.svg', label: 'Raspberry PI', tooltip: 'Raspberry PI 5 16Go' },
    { logo: '/img/svg/docker.svg', label: 'Docker', tooltip: '4 containers : Front, BFF, Serveur TUS, BDD' },
    { logo: '/img/svg/nginx.svg', label: 'Nginx', tooltip: 'Reverse Proxy' },
    { logo: '/img/svg/tus-protocol.svg', label: 'TUS Protocol' },
    { logo: '/img/svg/ovh-cloud.svg', label: 'OVH Cloud', tooltip: 'Gestion du nom de domaine' },
  ],
  tools: [
    { logo: '/img/svg/illustrator.svg', label: 'Illustrator', tooltip: 'Création d\'illustrations SVG' },
    { logo: '/img/svg/postman.svg', label: 'Postman' },
    { logo: '/img/svg/chatgpt.svg', label: 'ChatGPT', tooltip: 'Assitant technique' },
  ],
  order: 2,
};
