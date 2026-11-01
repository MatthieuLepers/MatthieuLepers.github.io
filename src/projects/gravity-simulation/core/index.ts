import { achievementsStore } from '@/core/entities/achievement/store';
import { Task } from '@/core/tasks';

import type { IGravityBenchmarkReport } from './geometry/QuadTree';
import { Vector2D } from './geometry/Vector2D';

interface IWorkerSnapshot {
  type: 'snapshot';
  particleCount: number;
  particleData: Float32Array;
  treeData: Float32Array;
  centerOfMass: { x: number; y: number };
  achievements: string[];
}

interface IWorkerBenchmarkResult {
  type: 'benchmark-result';
  reports: IGravityBenchmarkReport[];
}

interface IWorkerError {
  type: 'error';
  message: string;
}

type IWorkerResponse = IWorkerSnapshot | IWorkerBenchmarkResult | IWorkerError;

export class GravitySimulationTask extends Task {
  public ctx: CanvasRenderingContext2D | null = null;

  public options = {
    drawQuadTree: false,
    trackCenterOfMass: false,
  };

  public onBenchmarkResult?: (reports: IGravityBenchmarkReport[]) => void;

  private worker: Worker;

  private running = false;

  private inFlight = false;

  private particleCount = 0;

  private particleData = new Float32Array(0);

  private treeData = new Float32Array(0);

  private centerOfMass = { x: 0, y: 0 };

  constructor(
    public canvas: HTMLCanvasElement | null,
    public scene: HTMLDivElement | null,
  ) {
    super();
    this.enabled = true;

    this.worker = new Worker(
      new URL('./GravitySimulation.worker.ts', import.meta.url),
      { type: 'module' },
    );

    this.worker.addEventListener('message', (event: MessageEvent<IWorkerResponse>) => {
      const message = event.data;

      if (message.type === 'snapshot') {
        this.inFlight = false;
        this.particleCount = message.particleCount;
        this.particleData = message.particleData;
        this.treeData = message.treeData;
        this.centerOfMass = message.centerOfMass;

        message.achievements.forEach((achievementId) => {
          achievementsStore.actions.acquireByProject('Gravity Simulation', achievementId);
        });
        return;
      }

      if (message.type === 'benchmark-result') {
        this.onBenchmarkResult?.(message.reports);
        return;
      }

      this.inFlight = false;
      console.error('[GravitySimulation Worker]', message.message);
    });

    this.worker.addEventListener('error', (event) => {
      this.inFlight = false;
      console.error('[GravitySimulation Worker] Unhandled error', event);
    });
  }

  setCanvasSize(width: number, height: number) {
    if (!this.canvas) return;

    this.canvas.width = width;
    this.canvas.height = height;
  }

  init() {
    if (!this.canvas) return;

    this.worker.postMessage({
      type: 'init',
      width: this.canvas.width,
      height: this.canvas.height,
    });
  }

  setRunning(running: boolean) {
    this.running = running;
  }

  setOptions(options: Partial<typeof this.options>) {
    this.options = { ...this.options, ...options };
    this.worker.postMessage({ type: 'options', options: this.options });
  }

  spawnParticlesAt(position: Vector2D, count = 3) {
    this.worker.postMessage({
      type: 'spawn',
      x: position.x,
      y: position.y,
      count,
    });
  }

  benchmarkGravity() {
    this.worker.postMessage({ type: 'benchmark' });
  }

  private render() {
    if (!this.canvas || !this.ctx) return;

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    if (this.options.trackCenterOfMass) {
      ctx.translate(
        this.canvas.width / 2 - this.centerOfMass.x,
        this.canvas.height / 2 - this.centerOfMass.y,
      );
    }

    for (let index = 0; index < this.particleCount; index += 1) {
      const offset = index * 5;
      const x = this.particleData[offset];
      const y = this.particleData[offset + 1];
      const radius = this.particleData[offset + 2];
      const colorCode = this.particleData[offset + 3];
      const hasStroke = this.particleData[offset + 4] === 1;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);

      if (colorCode === 1 || colorCode === 2) {
        const color = colorCode === 1 ? '#ff4d3b' : '#ff0';
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = colorCode === 3 ? '#000' : '#fff';
      }

      ctx.fill();
      if (hasStroke) {
        ctx.strokeStyle = '#fff';
        ctx.stroke();
      }
    }

    if (this.options.drawQuadTree) {
      for (let index = 0; index < this.treeData.length; index += 7) {
        const x = this.treeData[index];
        const y = this.treeData[index + 1];
        const width = this.treeData[index + 2];
        const height = this.treeData[index + 3];
        const count = this.treeData[index + 4];
        const centerX = this.treeData[index + 5];
        const centerY = this.treeData[index + 6];

        ctx.strokeStyle = '#f00';
        ctx.strokeRect(x, y, width, height);

        if (count > 0) {
          ctx.fillStyle = '#00f';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(count.toString(), x + width / 2, y + height / 2, width);
          ctx.beginPath();
          ctx.arc(centerX, centerY, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  async frame() {
    if (!this.canvas) return;

    if (!this.ctx) {
      this.ctx = this.canvas.getContext('2d');
      return;
    }

    this.render();

    // Never queue multiple physics steps: the worker stays the source of truth,
    // while the main thread keeps rendering the most recently received snapshot.
    if (this.running && !this.inFlight) {
      this.inFlight = true;
      this.worker.postMessage({ type: 'step' });
    }
  }

  dispose() {
    this.running = false;
    this.worker.terminate();
  }
}
