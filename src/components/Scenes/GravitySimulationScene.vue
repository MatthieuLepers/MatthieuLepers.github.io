<template>
  <div class="scene scene--gravity-simulation" ref="scene">
    <canvas ref="canvas" />
    <button
      class="scene--btn scene--reset"
      type="button"
      title="Régénérer"
      @click.stop="actions.reset"
    >
      <span v-icon:refresh />
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';

import { appStore } from '@/core/stores/appStore';
import { GravitySimulationTask } from '@/core/tasks/GravitySimulation';
import { Vector2D } from '@/core/tasks/GravitySimulation/Vector2D';

const scene = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const state = reactive<{
  task: GravitySimulationTask | null,
}>({
  task: null,
});

const actions = {
  reset() {
    if (state.task) state.task.init();
  },
};

onMounted(() => {
  state.task = new GravitySimulationTask(canvas.value, scene.value);
  state.task.init();

  appStore.state.processManager.addTask(state.task);

  canvas.value?.addEventListener('click', (e) => {
    const mouse = new Vector2D(e.layerX, e.layerY);
    const particles = [...Array(4).keys()].map(() => state.task!.createParticleAt(Vector2D.randomPointAround(mouse, 10)));
    state.task!.particles.push(...particles);
  });
});
</script>

<style lang="scss">
@import './Scene';

.scene--gravity-simulation {
  border-radius: 24px 12px 24px 24px;
  position: relative;
}

.scene--btn {
  display: flex;
  place-items: center;
  padding: rem(4px);
  background-color: color(grey900);
  border-radius: 8px;
  position: relative;

  @include make-accessibility-shadow(color(secondary200));
}

.scene--reset {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;
}
</style>
