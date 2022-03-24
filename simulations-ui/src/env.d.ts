/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.gexf';

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
