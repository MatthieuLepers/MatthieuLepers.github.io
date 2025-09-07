import type { Component } from 'vue';

import type { IAchievement } from '@/core/Achievement';

export interface IProject {
  name: string;
  description: string;
  link: string;
  scene?: Component;
  github?: string;
  image?: string;
  visible?: boolean;
  order?: number;
}

interface IModule {
  project: IProject;

  achievements?: Record<string, IAchievement>;
}

const glob: Record<string, IModule> = import.meta.glob('@/projects/*/index.(ts|js)', { eager: true });

export const projects = Object
  .values(glob)
  .map((m) => m.project)
  .filter((p) => p.visible === undefined || p.visible)
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
;

export const achievements = Object
  .values(glob)
  .reduce((acc, m) => ({
    ...acc,
    ...(m.achievements ?? {}),
  }), {} as Record<string, IAchievement>)
;
