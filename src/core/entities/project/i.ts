import type { Component } from 'vue';

import type { ISVGPlanet } from '@/components/Svg';

type I18nString = Record<string, string>;

export interface ITechnologie {
  logo: string;
  label: string;
  abbreviation?: string;
  tooltip?: I18nString;
}

export interface IProject {
  id: string;
  name: I18nString;
  nameOverride?: I18nString;
  description: I18nString;
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

export interface IRawProject {
  readonly id: string;
  readonly visible: boolean;
  readonly order: number;
}
