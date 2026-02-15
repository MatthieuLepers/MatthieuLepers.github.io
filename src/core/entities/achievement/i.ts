type I18nString = Record<string, string>;

export interface IAchievement {
  id: string;
  name: I18nString;
  description: I18nString;
  order: number;
  clue: I18nString;
  project: I18nString;
  image: string;
  hidden?: boolean;
}
