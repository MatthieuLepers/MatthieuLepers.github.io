import { reactive } from 'vue';

import { ProcessManager } from '@/core/ProcessManager';
import type { Achievement } from '@/core/Achievement';
import { getLocalStorage } from '@/core/LocalStorage';

interface IState {
  theme: string;
  storyMode: boolean;
  processManager: ProcessManager;
  achievementList: Array<Achievement>;
  achivements: Array<string>;
}

const useAppStore = () => {
  const state = reactive<IState>({
    theme: 'Default',
    storyMode: false,
    processManager: new ProcessManager(),
    achievementList: [],
    achivements: [],
  });

  const actions = {
    load() {
      state.achivements = getLocalStorage<Array<string>>('achievements', '[]');
    },
  };

  return {
    state,
    actions,
  };
};

export const appStore = useAppStore();
