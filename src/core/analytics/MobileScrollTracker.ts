import i18n from '@/plugins/i18n';
import type { SectionEvent } from '@/core/analytics/types';
import { analyticsStore } from '@/core/analytics/store';
import { appStore } from '@/core/stores/appStore';

const MOBILE_WIDTH_THRESHOLD = 768;

const useMobileScrollTracker = () => {
  let currentSectionIndex: number = 0;

  const actions = {
    isMobile: () => navigator.userAgent.includes('Mobile') || window.innerWidth <= MOBILE_WIDTH_THRESHOLD,
    handleOnScroll() {
      const sections = [...document.querySelectorAll<HTMLElement>('.screen')];

      if (!sections.length) return;

      let closestIndex = 0;
      let smallestDistance = Infinity;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);

        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestIndex = index;
        }
      });

      if (currentSectionIndex === closestIndex) return;
      currentSectionIndex = closestIndex;

      const payload: Omit<SectionEvent, 'enteredAt' | 'duration'> = closestIndex === 0
        ? { type: 'hero' }
        : {
          type: 'project',
          origin: 'scroll',
          projectName: appStore.state.projects?.[closestIndex]?.name?.[i18n.global.locale.value],
        }
    ;

      analyticsStore.actions.onEnterSection(payload);
    },
  };

  return {
    setup() {
      let listening = false;

      if (actions.isMobile()) {
        window.addEventListener('scroll', actions.handleOnScroll);
        listening = true;
      }

      window.addEventListener('resize', () => {
        if (!actions.isMobile()) {
          window.removeEventListener('scroll', actions.handleOnScroll);
          listening = false;
        } else if (!listening) {
          window.addEventListener('scroll', actions.handleOnScroll);
          listening = true;
        }
      });
    },
  };
};

export const mobileScrollTracker = useMobileScrollTracker();
