import { Task } from '@/core/tasks';
import { Particle, type IParticle } from '@/core/tasks/GravitySimulation/Particle';
import { Vector2D } from '@/core/tasks/GravitySimulation/Vector2D';

const SUN_MASS = 1e5;

export class GravitySimulationTask extends Task {
  public particles: Array<Particle> = [];

  public ctx: CanvasRenderingContext2D | null = null;

  constructor(
    public canvas: HTMLCanvasElement | null,
    public scene: HTMLDivElement | null,
  ) {
    super();
    window.addEventListener('DOMContentLoaded', () => {
      this.setCanvasSize();
    });
  }

  private setCanvasSize() {
    if (this.canvas && this.scene) {
      const { width, height } = this.scene.getBoundingClientRect();
      this.canvas.width = width;
      this.canvas.height = height;
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
      const sun = new Vector2D(width / 2, height / 2);

      this.particles = [
        this.createParticleAt(sun, { color: '#ff0', mass: SUN_MASS, size: 5 }),
        ...[...Array(25).keys()].map(() => this.createParticleAt(Vector2D.randomPointAround(sun, Math.random() * (height / 2)))),
      ];
    }
  }

  async frame() {
    if (this.canvas) {
      if (!this.ctx) {
        this.ctx = this.canvas.getContext('2d');
      } else {
        this.setCanvasSize();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Compute gravity
        const forces = this.particles
          .map((p1) => this.particles.reduce((acc, p2) => (p1 === p2
            ? acc
            : acc.add(p1.computeGravitationalForce(p2))), new Vector2D()));

        this.particles.forEach((p1, i) => {
          p1.applyForce(forces[i]);

          this.particles.forEach((p2) => {
            if (p1 !== p2 && p1.collideWith(p2)) {
              if (p1.mass > p2.mass) {
                p1.mergeWith(p2);
                this.particles.splice(this.particles.indexOf(p2), 1);
              } else {
                p2.mergeWith(p1);
                this.particles.splice(this.particles.indexOf(p1), 1);
              }
            }
          });

          if (i > 0 && this.particles[0].position.distance(p1.position) >= this.canvas!.width) {
            this.particles.splice(this.particles.indexOf(p1), 1);
          }

          p1.render(this.ctx!);
        });

        if (this.particles.length < 25) {
          this.particles.push(...[...Array(25 - this.particles.length).keys()].map(() => {
            const position = new Vector2D(
              Math.random() * this.canvas!.width,
              Math.random() * this.canvas!.height,
            );
            return this.createParticleAt(position);
          }));
        }
      }
    }
  }
}
