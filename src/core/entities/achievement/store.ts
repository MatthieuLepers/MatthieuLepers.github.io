import { computed, reactive } from 'vue';

import i18n from '@/plugins/i18n';
import { getAchievements } from '@/projects';
import type { IAchievement } from '@/core/entities/achievement/i';
import { getLocalStorage, setLocalStorage } from '@/core/LocalStorage';

interface IState {
  achievements: Record<string, IAchievement>;
  acquiredAchievements: Array<string>;
  waitForAcquire: Array<string>;
}

const useAchievementsStore = () => {
  const { locale } = i18n.global;

  const state = reactive<IState>({
    achievements: {},
    acquiredAchievements: [],
    waitForAcquire: [],
  });

  const achivementsByProject = computed(() => Object
    .entries(state.achievements ?? {})
    .reduce((acc, [key, val]) => ({
      ...acc,
      [val.project[locale.value]]: [
        ...(acc[val.project[locale.value]] ?? []),
        { ...val, id: key },
      ].sort((a, b) => a.order - b.order),
    }), {} as Record<string, Array<IAchievement>>));

  const actions = {
    async load() {
      state.achievements = await getAchievements();
      state.acquiredAchievements = getLocalStorage<Array<string>>('achievements', '[]');
    },
    isAcquired(achievementId: string): boolean {
      return state.acquiredAchievements.includes(achievementId);
    },
    acquire(achievement: IAchievement) {
      if (!actions.isAcquired(achievement.id) && state.waitForAcquire.includes(achievement.id)) {
        state.acquiredAchievements.push(achievement.id);
        setLocalStorage('achievements', state.acquiredAchievements);
        state.waitForAcquire.splice(state.waitForAcquire.indexOf(achievement.id), 1);
      }
    },
    remove(achievement: IAchievement) {
      if (actions.isAcquired(achievement.id)) {
        state.acquiredAchievements.splice(state.acquiredAchievements.indexOf(achievement.id), 1);
        setLocalStorage('achievements', state.acquiredAchievements);
      }
    },
    hasAnyAchievements(): boolean {
      return state.acquiredAchievements.length > 0;
    },
    acquireByProject(project: string, achievementId: string) {
      if (actions.isAcquired(achievementId)) return;

      const found = achivementsByProject.value[project]?.find((achievement) => achievement.id === achievementId);

      if (found && !state.waitForAcquire.includes(found.id)) {
        state.waitForAcquire.push(found.id);
      }
    },
    countAcquiredByProject(project: string): number {
      return state.acquiredAchievements.reduce((acc, achievementId) => {
        const achivementObj = actions.getAchivementById(achievementId);
        return acc + Number(achivementObj.project[locale.value] === project && actions.isAcquired(achievementId));
      }, 0);
    },
    getAchivementById(achivementId: string): IAchievement {
      return state.achievements[achivementId];
    },
  };

  return {
    state,
    achivementsByProject,
    actions,
  };
};

export const achievementsStore = useAchievementsStore();
