import { getLocalStorage, setLocalStorage } from '@/core/LocalStorage';
import { achievements } from '@/projects';
import { appStore } from '@/core/stores/appStore';

export interface IAchievement {
  id: string;
  name: string;
  description: string;
  order: number;
  clue: string;
  project: string;
  image: string;
  hidden?: boolean;
}

export class Achievement {
  declare id: string;

  declare name: string;

  declare description: string;

  declare order: number;

  declare clue: string;

  declare project: string;

  declare image: string;

  declare hidden?: boolean;

  constructor(public data: IAchievement) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        get() { return this.data[key]; },
        set(v) { this.data[key] = v; },
      });
    });
  }

  get isAcquired(): boolean {
    return appStore.state.achivements.includes(this.id);
  }

  acquire() {
    const acquired = getLocalStorage<Array<string>>('achievements', '[]');
    if (!acquired.includes(this.id)) {
      acquired.push(this.id);
      setLocalStorage('achievements', acquired);
      appStore.state.achievementList.push(this);
      appStore.state.achivements.push(this.id);
    }
  }

  remove() {
    const acquired = getLocalStorage<Array<string>>('achievements', '[]');
    acquired.splice(acquired.indexOf(this.id), 1);
    setLocalStorage('achievements', acquired);
    appStore.state.achivements = acquired;
  }

  static isAcquired(id: string): boolean {
    return getLocalStorage<Array<string>>('achievements', '[]').includes(id);
  }

  static hasAnyAchievements(): boolean {
    return getLocalStorage<Array<string>>('achievements', '[]').length > 0;
  }
}

export const ACHIEVEMENTS = Object
  .entries(achievements)
  .reduce((acc, [key, val]) => ({
    ...acc,
    [val.project]: [
      ...(acc[val.project] ?? []),
      new Achievement({ ...val, id: key }),
    ].sort((a, b) => a.order - b.order),
  }), {} as Record<string, Array<Achievement>>)
;

export function findAchievement(project: string, id: string) {
  return ACHIEVEMENTS[project].find((achivement) => achivement.id === id);
}
