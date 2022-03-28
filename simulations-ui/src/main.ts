import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import FileUpload from 'primevue/fileupload';
import Divider from 'primevue/divider';

createApp(App)
  .use(store)
  .use(PrimeVue)
  .component('Card', Card)
  .component('TabView', TabView)
  .component('TabPanel', TabPanel)
  .component('FileUpload', FileUpload)
  .component('Divider', Divider)
  .mount('#app');
