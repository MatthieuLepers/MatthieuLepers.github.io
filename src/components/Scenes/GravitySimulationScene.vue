<template>
  <div class="scene scene--gravity-simulation" ref="scene">
    <canvas ref="canvas" />
    <div class="scene__btn">
      <button
        class="scene--btn scene--reset"
        type="button"
        title="Régénérer"
        @click.stop="actions.reset"
      >
        <span v-icon:refresh />
      </button>
      <button
        :class="`scene--btn scene--grid ${state.drawQuadTree ? 'scene--btn-on' : ''}`"
        type="button"
        :title="state.drawQuadTree ? 'Masquer le QuadTree' : 'Afficher le QuadTree'"
        @click.stop="state.drawQuadTree = !state.drawQuadTree"
      >
        <span v-icon:grid />
      </button>
      <button
        :class="`scene--btn scene--track ${state.trackCenterOfMass ? 'scene--btn-on' : ''}`"
        type="button"
        :title="state.trackCenterOfMass ? 'Ne plus suivre le centre de masse' : 'Suivre le centre de masse'"
        @click.stop="state.trackCenterOfMass = !state.trackCenterOfMass"
      >
        <span v-icon:crosshair />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  onMounted,
  watch,
} from 'vue';

import { appStore } from '@/core/stores/appStore';
import { GravitySimulationTask } from '@/core/tasks/GravitySimulation';
import { Vector2D } from '@/core/tasks/GravitySimulation/geometry/Vector2D';

const scene = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const state = reactive<{
  task: GravitySimulationTask | null;
  mousePos: Vector2D;
  showQuadTree: boolean;
  trackCenterOfMass: boolean;
}>({
  task: null,
  mousePos: new Vector2D(),
  drawQuadTree: false,
  trackCenterOfMass: false,
});

const actions = {
  reset() {
    if (state.task) state.task.init();
  },
};

watch(() => state.drawQuadTree, (drawQuadTree) => {
  state.task.options.drawQuadTree = drawQuadTree;
});

watch(() => state.trackCenterOfMass, (trackCenterOfMass) => {
  state.task.options.trackCenterOfMass = trackCenterOfMass;
});

onMounted(() => {
  state.task = new GravitySimulationTask(canvas.value, scene.value);
  state.task.init();

  const mouseTask = {
    enabled: false,
    async frame() {
      if (this.enabled) {
        const particles = [...Array(3).keys()].map(() => state.task!.createParticleAt(Vector2D.randomPointAround(state.mousePos, 10)));
        state.task!.particles.push(...particles);
      }
    },
  };

  appStore.state.processManager.addTask(state.task);
  appStore.state.processManager.addTask(mouseTask);

  canvas.value.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mouseTask.enabled = true;
    const { x, y } = canvas.value.getBoundingClientRect();
    state.mousePos = new Vector2D(e.clientX - x, e.clientY - y);
  });
  window.addEventListener('mouseup', () => {
    mouseTask.enabled = false;
  });
});
</script>

<style lang="scss">
@import './Scene';

.scene--gravity-simulation {
  border-radius: 24px 12px 24px 24px;
  position: relative;
}

.scene__btn {
  display: flex;
  flex-direction: column;
  gap: rem(4px);
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
}

.scene--btn {
  @include transition(background-color .2s ease);
  @include make-accessibility-shadow(color(secondary200));
  background-color: color(grey900);
  padding: rem(4px);
  border-radius: 8px;
  display: flex;
  place-items: center;
  position: relative;

  &-on {
    background-color: color(secondary200);
  }
}
</style>
