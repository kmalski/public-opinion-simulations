import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import VueFullscreen from 'vue-fullscreen';

import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import PrimeButton from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Toast from 'primevue/toast';
import ProgressBar from 'primevue/progressbar';

createApp(App)
  .use(createPinia())
  .use(PrimeVue)
  .use(ToastService)
  .use(VueFullscreen)
  .component('Card', Card)
  .component('Divider', Divider)
  .component('Dropdown', Dropdown)
  .component('FileUpload', FileUpload)
  .component('InputNumber', InputNumber)
  .component('InputSwitch', InputSwitch)
  .component('InputText', InputText)
  .component('MultiSelect', MultiSelect)
  .component('PrimeButton', PrimeButton)
  .component('ProgressBar', ProgressBar)
  .component('SelectButton', SelectButton)
  .component('TabPanel', TabPanel)
  .component('TabView', TabView)
  .component('Toast', Toast)
  .mount('#app');
