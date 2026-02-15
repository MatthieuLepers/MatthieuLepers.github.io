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
