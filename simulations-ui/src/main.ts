import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import VueFullscreen from 'vue-fullscreen';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import Button from 'primevue/button';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import FileUpload from 'primevue/fileupload';
import Divider from 'primevue/divider';

createApp(App)
  .use(createPinia())
  .use(PrimeVue)
  .use(VueFullscreen)
  .component('Button', Button)
  .component('Card', Card)
  .component('TabView', TabView)
  .component('TabPanel', TabPanel)
  .component('FileUpload', FileUpload)
  .component('Divider', Divider)
  .mount('#app');
