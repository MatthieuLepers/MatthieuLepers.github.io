import { appStore } from '@/core/stores/appStore';
import { Jupiter } from '@/components/Svg';

export const project = {
  name: {
    'fr-FR': 'GED Multimédia',
    'en-EN': 'Multimedia Plateform',
  },
  description: {
    'fr-FR': [
      'Une plateforme multimédia perso inspirée de Google Photos et auto-hébergé sur mon raspberry pi. C’est un de mes plus gros projet, il mêle front, back for front avec API REST, stockage de fichier, cybersécurité, gestion d’archi et d’infra, optimisation...',
      'Une version de démo est accéssible pour les plus curieux.',
    ],
    'en-EN': [
      'A personal multimedia platform inspired by Google Photos and self-hosted on my Raspberry Pi. It’s one of my biggest projects, combining front-end, back-end with REST API, file storage, cybersecurity, architecture and infrastructure management, optimization...',
      'A demo version is available for those who are curious.',
    ],
  },
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
    {
      logo: '/img/svg/vuejs.svg',
      label: 'Vue.JS',
      tooltip: {
        'fr-FR': 'Vue 3',
        'en-EN': 'Vue 3',
      },
    },
    { logo: '/img/svg/typescript.svg', label: 'TypeScript' },
    { logo: '/img/svg/sass.svg', label: 'SASS' },
    {
      logo: '/img/svg/nodejs.svg',
      label: 'Node.JS',
      tooltip: {
        'fr-FR': 'Node 22',
        'en-EN': 'Node 22',
      },
    },
    { logo: '/img/svg/nestjs.svg', label: 'NestJS' },
    {
      logo: '/img/svg/gcp.svg',
      label: 'Google Cloud',
      tooltip: {
        'fr-FR': 'OAuth et ReCaptcha',
        'en-EN': 'OAuth and ReCaptcha',
      },
    },
    { logo: '/img/svg/vitejs.png', label: 'Vite' },
    { logo: '/img/svg/sequelize.svg', label: 'Sequelize' },
    { logo: '/img/svg/mysql.svg', label: 'MySQL' },
    { logo: '/img/svg/socket.io.svg', label: 'Socket.IO' },
    {
      logo: '/img/svg/tus-protocol.svg',
      label: 'TUS Protocol',
      tooltip: {
        'fr-FR': 'Upload de fichiers volumineux par chunks',
        'en-EN': 'Uploading large files in chunks',
      },
    },
    { logo: '/img/svg/uppy.svg', label: 'Uppy' },
    {
      logo: '/img/svg/redis.svg',
      label: 'Redis',
      tooltip: {
        'fr-FR': 'Gestion de queues avec bull',
        'en-EN': 'Queue management with bull',
      },
    },
    {
      logo: '/img/svg/puppeteer.svg',
      label: 'Puppeteer',
      tooltip: {
        'fr-FR': 'Fallback pour le téléchargmement via URL',
        'en-EN': 'Fallback for downloading via URL',
      },
    },
    {
      logo: '/img/svg/ffmpeg.svg',
      label: 'ffmpeg',
      tooltip: {
        'fr-FR': 'Génération de miniatures et convertion vidéos',
        'en-EN': 'Thumbnail generation and video conversion',
      },
    },
    { logo: '/img/svg/svg.svg', label: 'SVG', abbreviation: 'Scalable Vector Graphics' },
    {
      logo: '/img/svg/mjml.svg',
      label: 'MJML',
      tooltip: {
        'fr-FR': 'Création emailings',
        'en-EN': 'Email creation',
      },
    },
  ],
  deployment: [
    {
      logo: '/img/svg/raspberry-pi.svg',
      label: 'Raspberry PI',
      tooltip: {
        'fr-FR': 'Raspberry PI 5 16Go',
        'en-EN': 'Raspberry PI 5 16Go',
      },
    },
    {
      logo: '/img/svg/docker.svg',
      label: 'Docker',
      tooltip: {
        'fr-FR': '4 containers : Front, BFF, Serveur TUS, BDD',
        'en-EN': '4 containers: Front, BFF, TUS Server, Database',
      },
    },
    {
      logo: '/img/svg/nginx.svg',
      label: 'Nginx',
      tooltip: {
        'fr-FR': 'Reverse Proxy',
        'en-EN': 'Reverse Proxy',
      },
    },
    { logo: '/img/svg/tus-protocol.svg', label: 'TUS Protocol' },
    {
      logo: '/img/svg/ovh-cloud.svg',
      label: 'OVH Cloud',
      tooltip: {
        'fr-FR': 'Gestion du nom de domaine',
        'en-EN': 'Domain name management',
      },
    },
  ],
  tools: [
    {
      logo: '/img/svg/illustrator.svg',
      label: 'Illustrator',
      tooltip: {
        'fr-FR': 'Création d’illustrations SVG',
        'en-EN': 'Creating SVG illustrations',
      },
    },
    { logo: '/img/svg/postman.svg', label: 'Postman' },
    {
      logo: '/img/svg/chatgpt.svg',
      label: 'ChatGPT',
      tooltip: {
        'fr-FR': 'Assitant technique',
        'en-EN': 'Technical assistant',
      },
    },
  ],
  order: 2,
};
