<template>
  <div
    :class="GenerateModifiers('scene', {
      'gravity-simulation': true,
    })"
    ref="scene"
  >
    <canvas ref="canvas" />

    <div v-if="state.started" class="scene__controls">
      <button
        :class="GenerateModifiers('scene__btn', {
          reset: true,
        })"
        type="button"
        :title="t('Project.GravitySimulation.regenerate')"
        @click.prevent.stop="actions.reset"
      >
        <span v-icon:refresh />
      </button>
      <button
        :class="GenerateModifiers('scene__btn', {
          grid: true,
          on: state.drawQuadTree,
        })"
        type="button"
        :title="state.drawQuadTree ? t('Project.GravitySimulation.hideQuadTree') : t('Project.GravitySimulation.showQuadTree')"
        @click.prevent.stop="state.drawQuadTree = !state.drawQuadTree"
      >
        <span v-icon:grid />
      </button>
      <button
        :class="GenerateModifiers('scene__btn', {
          track: true,
          on: state.trackCenterOfMass,
        })"
        type="button"
        :title="state.trackCenterOfMass ? t('Project.GravitySimulation.untrackCenterOfMass') : t('Project.GravitySimulation.trackCenterOfMass')"
        @click.prevent.stop="state.trackCenterOfMass = !state.trackCenterOfMass"
      >
        <span v-icon:crosshair />
      </button>
    </div>

    <div v-else :class="GenerateModifiers('scene__controls', {
      fullscreen: true,
    })">
      <button
        :class="GenerateModifiers('scene__btn', {
          start: true,
        })"
        type="button"
        :title="t('Project.GravitySimulation.start')"
        @click.prevent.stop="state.started = true"
      >
        <span v-icon:play />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
  getCurrentInstance,
} from 'vue';
import { useI18n } from 'vue-i18n';

import { appStore } from '@/core/stores/appStore';
import type { Task } from '@/core/tasks';
import { GravitySimulationTask } from './core';
import { Vector2D } from './core/geometry/Vector2D';

const { t } = useI18n();
const scene = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const $uid = getCurrentInstance()?.uid;

const state = reactive<{
  task: GravitySimulationTask | null;
  mouseTask: Task | null;
  mousePos: Vector2D;
  drawQuadTree: boolean;
  trackCenterOfMass: boolean;
  started: boolean;
}>({
  task: null,
  mouseTask: null,
  mousePos: new Vector2D(),
  drawQuadTree: false,
  trackCenterOfMass: false,
  started: false,
});

const actions = {
  reset() {
    if (state.task) state.task.init();
  },
};

watch(() => state.drawQuadTree, (drawQuadTree) => {
  state.task!.options.drawQuadTree = drawQuadTree;
});

watch(() => state.trackCenterOfMass, (trackCenterOfMass) => {
  state.task!.options.trackCenterOfMass = trackCenterOfMass;
});

watch(() => state.started, (started) => {
  state.task!.enabled = started;
});

onMounted(async () => {
  state.task = new GravitySimulationTask(canvas.value, scene.value);

  state.mouseTask = {
    id: `mousetask${$uid}`,
    enabled: false,
    async frame() {
      if (this.enabled) {
        const particles = [...Array(3).keys()].map(() => state.task!.createParticleAt(Vector2D.randomPointAround(state.mousePos, 10)));
        state.task!.particles.push(...particles);
      }
    },
  } as Task;

  appStore.processManager.addTask(state.task);
  appStore.processManager.addTask(state.mouseTask);

  canvas.value?.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    state.mouseTask!.enabled = true;
    const { x, y } = canvas.value!.getBoundingClientRect();
    state.mousePos = new Vector2D(e.clientX - x, e.clientY - y);
  });
  window.addEventListener('mouseup', () => {
    state.mouseTask!.enabled = false;
  });

  await nextTick();

  const { width, height } = scene.value!.closest('.carousel__slide')!.getBoundingClientRect();
  state.task!.setCanvasSize(width, height);
  state.task!.init();

  // Run first 2 frames then wait for user to click "start"
  await state.task!.frame();
  await state.task!.frame();
});

onUnmounted(() => {
  appStore.processManager.removeTask(state.task!);
  appStore.processManager.removeTask(state.mouseTask!);
});
</script>

<style lang="scss">
@use '~styles/utilities' as *;
@use '../Scene';

.scene--gravity-simulation {
  position: relative;
}

.scene__controls {
  display: flex;
  flex-direction: column;
  gap: rem(4px);
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 1;

  &--fullscreen {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: rgba(color(primary900), .6);
      color: color(text300);
      font-size: rem(42px);
    }
  }
}

.scene__btn {
  @include transition(background-color .2s ease);
  @include make-accessibility-shadow(color(secondary200));
  background-color: color(grey900);
  padding: rem(4px);
  border-radius: 8px;
  display: flex;
  place-items: center;
  position: relative;

  &--on {
    background-color: color(secondary200);
  }
}
</style>
