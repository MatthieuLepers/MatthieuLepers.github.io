import type { Component } from 'vue';

import type { IAchievement } from '@/core/entities/achievement/i';
import type { ISVGPlanet } from '@/components/Svg';

type I18nString = Record<string, string>;
type I18nStringArray = Record<string, Array<string>>;

export interface ITechnologie {
  logo: string;
  label: string;
  abbreviation?: string;
  tooltip?: I18nString;
}

export interface IProject {
  name: I18nString;
  nameOverride?: I18nString;
  description: I18nStringArray;
  link: string;
  scene?: Component;
  github?: string;
  medias?: string[];
  navigationSvg: ISVGPlanet;
  navigationOnClick: () => void;
  technologies?: ITechnologie[];
  deployment?: ITechnologie[];
  tools?: ITechnologie[];
  visible?: boolean;
  order?: number;
}

interface IModule {
  project: IProject;

  achievements?: Record<string, IAchievement>;
}

const glob = import.meta.glob<boolean, string, IModule>('@/projects/*/index.(ts|js)');

export async function getProjects() {
  const modules = await Promise.all(
    Object.values(glob).map((load) => load()),
  );

  return modules
    .map((m) => m.project)
    .filter((p) => p.visible === undefined || p.visible)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  ;
}

export async function getAchievements() {
  const modules = await Promise.all(
    Object.values(glob).map((load) => load()),
  );

  return modules
    .reduce((acc, m) => ({
      ...acc,
      ...(Object
        .entries(m.achievements ?? {})
        .reduce((ac, [name, achievement]) => ({
          ...ac,
          [name]: {
            ...achievement,
            id: name,
            project: m.project.nameOverride ?? m.project.name,
          },
        }), {})
      ),
    }), {} as Record<string, IAchievement>)
  ;
}
