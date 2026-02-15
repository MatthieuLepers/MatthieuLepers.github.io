import { reactive, computed } from 'vue';
import { gsap } from 'gsap';

import { getProjects, type IProject } from '@/projects';
import { ProcessManager } from '@/core/ProcessManager';

interface IState {
  projects: Array<IProject>;
  oldIndex: number;
  currentIndex: number;
  isScrolling: boolean;
  settings: {
    showTrajectories: boolean;
  };
}

const useAppStore = () => {
  const processManager = new ProcessManager();

  const state = reactive<IState>({
    projects: [],
    oldIndex: 0,
    currentIndex: 0,
    isScrolling: false,
    settings: {
      showTrajectories: false,
    },
  });

  const hasPrevScreen = computed(() => state.currentIndex > 0);

  const hasNextScreen = computed(() => state.currentIndex < state.projects.length - 1);

  const actions = {
    async load() {
      state.projects = await getProjects();
    },
    scrollToScreen(screenIndex: number) {
      const screens = document.getElementsByClassName('screen');

      if (screenIndex < 0 || screenIndex >= screens.length || state.isScrolling) {
        return;
      }

      state.isScrolling = true;
      state.currentIndex = screenIndex;

      gsap.to(window, {
        scrollTo: {
          y: screens[screenIndex],
          autoKill: false,
        },
        duration: 1,
        ease: 'expo.out',
        onComplete() {
          state.isScrolling = false;
        },
      });
    },
  };

  return {
    state,
    processManager,
    hasPrevScreen,
    hasNextScreen,
    actions,
  };
};

export const appStore = useAppStore();
