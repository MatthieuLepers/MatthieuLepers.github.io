import { Task } from '@/core/tasks';
import { Particle, type IParticle } from '@/core/tasks/GravitySimulation/Particle';
import { Vector2D } from '@/core/tasks/GravitySimulation/geometry/Vector2D';
import { QuadTreeNode } from '@/core/tasks/GravitySimulation/geometry/QuadTree';

export class GravitySimulationTask extends Task {
  public particles: Array<Particle> = [];

  public ctx: CanvasRenderingContext2D | null = null;

  public quadTree!: QuadTreeNode;

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
      this.enabled = true;
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

        this.quadTree.clear();
        this.quadTree.insertAll(this.particles);

        this.quadTree.computeGravity();
        this.quadTree.computeCollision();
        this.quadTree.removeFarParticles(this.canvas.height);

        this.particles = this.quadTree.getParticles();

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
