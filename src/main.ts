import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/plugins/router';
import i18n from '@/plugins/i18n';
import GenerateModifiers from '@/plugins/GenerateModifiers';
import DateFormat from '@/plugins/DateFormat';

const app = createApp(App);

app.directive('icon', {
  created(el, binding) {
    el.classList.add(`icon-${binding.arg}`);
  },
});

app.use(router);
app.use(i18n);
app.use(GenerateModifiers);
app.use(DateFormat);
app.mount('#app');
