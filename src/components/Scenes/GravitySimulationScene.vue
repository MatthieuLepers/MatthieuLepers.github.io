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

import { debounce } from '@/core/utils';

type Vector2D = { x: number; y: number };

interface Particle {
  id: number;
  position: Vector2D;
  velocity: Vector2D;
  color: string;
  mass: number;
  size: number;
}

const scene = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const G = 6.67e-3;
const EPSILON = 1e-5;
const C = 299_792_458;

const negate = (v: Vector2D): Vector2D => ({ x: -v.x, y: -v.y });
const add = (v1: Vector2D, v2: Vector2D): Vector2D => ({ x: v1.x + v2.x, y: v1.y + v2.y });
const sub = (v1: Vector2D, v2: Vector2D): Vector2D => add(v1, negate(v2));
const mult = (v: Vector2D, scalar: number): Vector2D => ({ x: v.x * scalar, y: v.y * scalar });
const div = (v: Vector2D, scalar: number): Vector2D => ({ x: v.x / scalar, y: v.y / scalar });
const clamp = (v: Vector2D, min: number, max: number): Vector2D => ({
  x: Math.max(min, Math.min(max, v.x)),
  y: Math.max(min, Math.min(max, v.y)),
});
const length = (v: Vector2D): number => Math.sqrt(v.x ** 2 + v.y ** 2);
const normalize = (v: Vector2D): Vector2D => div(v, length(v));

const randomPointAround = (pos: Vector2D, r: number): Vector2D => {
  const t = 2 * Math.PI * Math.random();
  const u = Math.sqrt(Math.random()) * r;
  return { x: pos.x + u * Math.cos(t), y: pos.y + u * Math.sin(t) };
};
const updatePositionAndBounce = (p: Particle): void => {
  const radius = p.size;
  const { width, height } = canvas.value!;

  // Update position
  p.position = add(p.position, p.velocity);

  // Rebond sur les bords
  if (p.position.x - radius < 0 || p.position.x + radius > width) {
    p.velocity.x *= -0.01;
    p.position.x = Math.max(radius, Math.min(width - radius, p.position.x));
  }

  if (p.position.y - radius < 0 || p.position.y + radius > height) {
    p.velocity.y *= -0.01;
    p.position.y = Math.max(radius, Math.min(height - radius, p.position.y));
  }
};

const state = reactive<{
  particles: Array<Particle>;
  sunPos: Vector2D;
}>({
  particles: [],
  sunPos: { x: 0, y: 0 },
});

const actions = {
  setCanvasSize() {
    if (canvas.value && scene.value) {
      const bbox = scene.value.getBoundingClientRect();

      canvas.value.width = bbox.width;
      canvas.value.height = bbox.height;
    }
  },
  computeGravitationalForce(p1: Particle, p2: Particle): Vector2D {
    const direction = sub(p2.position, p1.position);
    const dist = Math.max(length(direction), 1);

    const forceMagnitude = (G * p1.mass * p2.mass) / (dist ** 2);

    if (dist <= EPSILON) {
      return { x: 0, y: 0 };
    }

    return mult(normalize(direction), forceMagnitude);
  },
  reset() {
    state.particles = [
      {
        id: 0,
        position: state.sunPos,
        velocity: { x: 0, y: 0 },
        color: '#ff0',
        mass: 1000,
        size: 10,
      },
      ...[...Array(10).keys()].map((i) => ({
        id: i + 1,
        position: randomPointAround(state.sunPos, Math.random() * (canvas.value!.height / 2)),
        velocity: {
          // x: 0,
          x: (Math.random() * 2 - 1) * 2,
          // y: 0,
          y: (Math.random() * 2 - 1) * 2,
        },
        color: '#fff',
        mass: 750,
        size: 4,
      })),
    ];
  },
};

onMounted(() => {
  window.addEventListener('resize', debounce(() => { actions.setCanvasSize(); }, 100));
  window.addEventListener('DOMContentLoaded', () => {
    actions.setCanvasSize();

    const canvasEl = canvas.value!;
    const ctx = canvasEl.getContext('2d')!;

    state.sunPos = { x: canvasEl.width / 2, y: canvasEl.height / 2 };
    actions.reset();

    const frame = () => {
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

      // Compute gravitation forces
      const forces = state.particles.map((p1) => state.particles.reduce((acc, p2) => (p1 === p2
        ? acc
        : add(acc, actions.computeGravitationalForce(p1, p2))), { x: 0, y: 0 }));

      state.particles.forEach((p1, i) => {
        // Apply gravitation force
        const acceleration = div(forces[i], p1.mass);
        p1.velocity = clamp(add(p1.velocity, acceleration), -C, C);
        if (p1.id > 0) {
          // p1.position = add(p1.position, p1.velocity);
          updatePositionAndBounce(p1);
        }

        // Render
        ctx.fillStyle = p1.color;
        ctx.beginPath();
        ctx.ellipse(p1.position.x, p1.position.y, p1.size, p1.size, 0, 0, 2 * Math.PI);
        ctx.fill();
      });

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
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
