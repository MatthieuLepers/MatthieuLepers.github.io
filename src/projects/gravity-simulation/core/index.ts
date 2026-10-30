import { Task } from '@/core/tasks';

import { QuadTreeNode } from './geometry/QuadTree';
import { Vector2D } from './geometry/Vector2D';
import { type IParticle,Particle } from './Particle';

export class GravitySimulationTask extends Task {
  public particles: Array<Particle> = [];

  public ctx: CanvasRenderingContext2D | null = null;

  public quadTree!: QuadTreeNode;

  private frameCount = 0;

  public options = {
    drawQuadTree: false,
    trackCenterOfMass: false,
  };

  constructor(
    public canvas: HTMLCanvasElement | null,
    public scene: HTMLDivElement | null,
  ) {
    super();
    this.enabled = false;
  }

  setCanvasSize(width: number, height: number) {
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;

      if (!this.quadTree) {
        this.quadTree = QuadTreeNode.create({
          x: 0,
          y: 0,
          width,
          height,
        });
      }
    }
  }

  createParticleAt(pos: Vector2D, options: Partial<IParticle> = {}) {
    return new Particle({
      position: pos,
      velocity: new Vector2D(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ),
      color: '#fff',
      mass: Math.random() * 1e3,
      size: 1,
      canvas: this.canvas!,
      ...options,
    });
  }

  init() {
    if (this.canvas) {
      const { width, height } = this.canvas;
      // const center = new Vector2D(width / 2, height / 2);

      this.particles = [...Array(1000).keys()]
        .map(() => this.createParticleAt(
          Vector2D.generatePoint(width, height),
          // Vector2D.generateGaussianPoint(
          //   center,
          //   Math.random() * (height / 2),
          // ),
        ))
      ;
    }
  }

  async frame() {
    if (this.canvas) {
      if (!this.ctx) {
        this.ctx = this.canvas.getContext('2d');
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const frameStartedAt = performance.now();
        const particlesAtFrameStart = this.particles.length;
        let phaseStartedAt = frameStartedAt;

        this.quadTree.clear();
        this.quadTree.insertAll(this.particles);
        const initialTreeMs = performance.now() - phaseStartedAt;

        phaseStartedAt = performance.now();
        const gravityDiagnostics = this.quadTree.computeGravity();
        const gravityMs = performance.now() - phaseStartedAt;

        // Gravity moves particles, so rebuild the tree before spatial collision checks.
        phaseStartedAt = performance.now();
        this.quadTree.clear();
        this.quadTree.insertAll(this.particles);
        const collisionTreeMs = performance.now() - phaseStartedAt;

        phaseStartedAt = performance.now();
        this.quadTree.computeCollision();
        const collisionMs = performance.now() - phaseStartedAt;

        phaseStartedAt = performance.now();
        this.quadTree.removeFarParticles(this.canvas.height);
        const cleanupMs = performance.now() - phaseStartedAt;

        this.particles = this.quadTree.getParticles();

        this.frameCount += 1;
        const shouldLogFrame = this.frameCount <= 10
          || (this.frameCount <= 100 && this.frameCount % 10 === 0)
          || this.frameCount % 60 === 0;

        if (shouldLogFrame) {
          console.info('[GravitySimulation] Performance (last frame)', {
            frame: this.frameCount,
            particlesAtFrameStart,
            particlesAfterCleanup: this.particles.length,
            initialTreeMs,
            gravityMs,
            gravity: gravityDiagnostics,
            collisionTreeMs,
            collisionMs,
            cleanupMs,
            frameTotalMs: performance.now() - frameStartedAt,
          });
        }

        if (this.options.trackCenterOfMass) {
          this.ctx.save();
          this.ctx.translate(
            this.canvas.width / 2 - this.quadTree.centerOfMass.position.x,
            this.canvas.height / 2 - this.quadTree.centerOfMass.position.y,
          );
        }

        this.particles.forEach((p) => {
          p.render(this.ctx!);
        });

        if (this.options.trackCenterOfMass) {
          this.ctx.restore();
        }

        if (this.options.drawQuadTree) {
          this.quadTree.render(this.ctx);
        }

        // if (this.particles.length < 25) {
        //   const currentCenter = this.quadTree.centerOfMass.position;
        //   const newParticles = [...Array(25 - this.particles.length).keys()].map(() => {
        //     const position = new Vector2D(
        //       Math.random() * this.canvas!.width,
        //       Math.random() * this.canvas!.height,
        //     );
        //     return this.createParticleAt(position.add(currentCenter));
        //   });
        //   this.particles.push(...newParticles);
        // }
      }
    }
  }
}
