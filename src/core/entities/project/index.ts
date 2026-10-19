import AbstractEntity from '@/core/entities/AbstractEntity';
import type { IProject, IRawProject } from '@/core/entities/project/i';
import axiosInstance from '@/core/services/Axios';

import { getProjectsAsRecord } from '@/projects';

export class Project extends AbstractEntity<IProject> {
  declare id: IProject['id'];

  declare name: IProject['name'];

  declare nameOverride: IProject['nameOverride'];

  declare description: IProject['description'];

  declare link: IProject['link'];

  declare scene: IProject['scene'];

  declare github: IProject['github'];

  declare medias: IProject['medias'];

  declare navigationSvg: IProject['navigationSvg'];

  declare navigationOnClick: IProject['navigationOnClick'];

  declare technologies: IProject['technologies'];

  declare deployment: IProject['deployment'];

  declare tools: IProject['tools'];

  declare visible: IProject['visible'];

  declare order: IProject['order'];

  constructor(data: IProject) {
    super(data);
  }

  static async findAll(): Promise<Array<Project>> {
    const staticData = await getProjectsAsRecord();

    try {
      const response = await axiosInstance.get<Array<IRawProject>>('/projects');

      if (response.status !== 200) throw new Error('API is not available');

      return response.data
        .filter(({ id }) => staticData[id] !== undefined)
        .map((raw) => new Project({
          ...staticData[raw.id],
          ...raw,
        }))
      ;
    } catch {
      return Object
        .values(staticData)
        .filter(({ visible }) => visible !== false)
        .map((data) => new Project(data))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      ;
    }
  }
}
