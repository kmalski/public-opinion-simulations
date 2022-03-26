import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

import PrimeVue from 'primevue/config';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

createApp(App)
  .use(store)
  .use(PrimeVue)
  .component('Card', Card)
  .component('TabView', TabView)
  .component('TabPanel', TabPanel)
  .mount('#app');
