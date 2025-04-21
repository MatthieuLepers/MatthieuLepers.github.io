import { reactive } from 'vue';

import { ProcessManager } from '@/core/ProcessManager';

const useAppStore = () => {
  const state = reactive({
    theme: 'Default',
    storyMode: false,
    processManager: new ProcessManager(),
  });

  return {
    state,
  };
};

export const appStore = useAppStore();
