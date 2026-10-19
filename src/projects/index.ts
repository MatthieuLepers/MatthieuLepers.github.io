import type { IAchievement } from '@/core/entities/achievement/i';
import type { IProject } from '@/core/entities/project/i';

interface IModule {
  project: IProject;

  achievements?: Record<string, IAchievement>;
}

const glob = import.meta.glob<boolean, string, IModule>('@/projects/*/index.(ts|js)');

export async function getProjectsAsRecord() {
  const modules = await Promise.all(
    Object.values(glob).map((load) => load()),
  );

  return modules
    .reduce((acc, m) => ({
      ...acc,
      [m.project.id]: m.project,
    }), {} as Record<string, IProject>)
  ;
}

// export async function getProjects() {
//   const modules = await Promise.all(
//     Object.values(glob).map((load) => load()),
//   );

//   return modules
//     .map((m) => m.project)
//     .filter((p) => p.visible === undefined || p.visible)
//     .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
//   ;
// }

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
