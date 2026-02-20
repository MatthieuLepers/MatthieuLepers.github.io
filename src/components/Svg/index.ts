import { markRaw, type Component } from 'vue';

import SVGPathEarth from '@/components/Svg/Earth.vue';
import SVGPathPlanet2 from '@/components/Svg/Planet2.vue';
import SVGPathJupiter from '@/components/Svg/Jupiter.vue';
import SVGPathSaturn from '@/components/Svg/Saturn.vue';
import SVPPathUranus from '@/components/Svg/Uranus.vue';
import SVGPathIcyPlanet from '@/components/Svg/Icy.vue';

export interface ISVGPlanet {
  component: Component;
  width: number;
  height: number;
}

export const Earth = {
  component: markRaw(SVGPathEarth),
  width: 66.3,
  height: 66.3,
};

export const Planet2 = {
  component: markRaw(SVGPathPlanet2),
  width: 79,
  height: 79,
};

export const Jupiter = {
  component: markRaw(SVGPathJupiter),
  width: 119,
  height: 119,
};

export const Saturn = {
  component: markRaw(SVGPathSaturn),
  width: 82,
  height: 82,
};

export const Uranus = {
  component: markRaw(SVPPathUranus),
  width: 83,
  height: 83,
};

export const IcyPlanet = {
  component: markRaw(SVGPathIcyPlanet),
  width: 61,
  height: 61,
};
