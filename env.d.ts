/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly HTTPS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    GenerateModifiers: (baseClass: string, modifiers: Record<string, boolean>) => string;
    dateFormat: (date: Date, format: string) => string;
  }
}

export {};
