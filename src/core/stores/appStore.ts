import { gsap } from 'gsap';
import { computed,reactive } from 'vue';

import type { SectionEventOrigin } from '@/core//analytics/types';
import { analyticsStore } from '@/core/analytics/store';
import { Project } from '@/core/entities/project';
import type { IProject } from '@/core/entities/project/i';
import { ProcessManager } from '@/core/ProcessManager';

import i18n from '@/plugins/i18n';

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
      state.projects = await Project.findAll();
    },
    scrollToScreen(screenIndex: number, origin?: SectionEventOrigin) {
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
          analyticsStore.actions.onEnterSection({
            type: 'project',
            origin,
            projectName: state.projects?.[state.currentIndex]?.name?.[i18n.global.locale.value],
          });
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
