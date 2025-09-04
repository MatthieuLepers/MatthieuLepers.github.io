<template>
  <div
    :class="GenerateModifiers('scene', {
      'gravity-simulation': true,
      fullscreen: props.fullscreen,
    })"
    ref="scene"
  >
    <canvas ref="canvas" />

    <div class="scene__controls">
      <button
        :class="GenerateModifiers('scene__btn', {
          reset: true,
        })"
        type="button"
        title="Régénérer"
        @click.stop="actions.reset"
      >
        <span v-icon:refresh />
      </button>
      <button
        :class="GenerateModifiers('scene__btn', {
          grid: true,
          on: state.drawQuadTree,
        })"
        type="button"
        :title="state.drawQuadTree ? 'Masquer le QuadTree' : 'Afficher le QuadTree'"
        @click.stop="state.drawQuadTree = !state.drawQuadTree"
      >
        <span v-icon:grid />
      </button>
      <button
        :class="GenerateModifiers('scene__btn', {
          track: true,
          on: state.trackCenterOfMass,
        })"
        type="button"
        :title="state.trackCenterOfMass ? 'Ne plus suivre le centre de masse' : 'Suivre le centre de masse'"
        @click.stop="state.trackCenterOfMass = !state.trackCenterOfMass"
      >
        <span v-icon:crosshair />
      </button>
    </div>

    <button
      :class="GenerateModifiers('scene__btn', {
        fullscreen: true,
      })"
      type="button"
      @click.stop="emit('fullscreen')"
    >
      <span v-icon:fullscreen />
    </button>
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
} from 'vue';

import { appStore } from '@/core/stores/appStore';
import { GravitySimulationTask } from '@/core/tasks/GravitySimulation';
import { Vector2D } from '@/core/tasks/GravitySimulation/geometry/Vector2D';
import type { Task } from '@/core/tasks';

const scene = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const emit = defineEmits<{
  fullscreen: [];
}>();

const props = defineProps<{
  fullscreen: boolean;
}>();

const state = reactive<{
  task: GravitySimulationTask | null;
  mouseTask: Task | null;
  mousePos: Vector2D;
  drawQuadTree: boolean;
  trackCenterOfMass: boolean;
}>({
  task: null,
  mouseTask: null,
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
  state.task!.options.drawQuadTree = drawQuadTree;
});

watch(() => state.trackCenterOfMass, (trackCenterOfMass) => {
  state.task!.options.trackCenterOfMass = trackCenterOfMass;
});

onMounted(async () => {
  state.task = new GravitySimulationTask(canvas.value, scene.value);

  state.mouseTask = {
    id: 'mousetask',
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

  const { width, height } = scene.value!.getBoundingClientRect();
  state.task!.setCanvasSize(
    props.fullscreen ? window.innerWidth : width,
    props.fullscreen ? window.innerHeight : height,
  );
  state.task!.init();
});

onUnmounted(() => {
  appStore.processManager.removeTask(state.task!);
  appStore.processManager.removeTask(state.mouseTask!);
});
</script>

<style lang="scss">
@import './Scene';

.scene--gravity-simulation {
  border-radius: 24px 12px 24px 24px;
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

  &--fullscreen {
    position: absolute;
    top: 4px;
    left: 4px;
  }
}
</style>
