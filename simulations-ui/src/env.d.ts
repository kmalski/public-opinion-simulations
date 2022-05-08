/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.gexf';
declare module '*.dot';

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_SERVER_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
