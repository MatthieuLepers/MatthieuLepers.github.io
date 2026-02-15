import { createI18n } from 'vue-i18n';
import i18n from '@/i18n';

const VueI18n = createI18n({
  locale: 'fr-FR',
  allowComposition: true,
  messages: i18n,
  globalInjection: true,
  legacy: false,
});

export default VueI18n;
