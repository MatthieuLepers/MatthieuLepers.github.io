import { Rectangle } from '@/core/tasks/GravitySimulation/geometry/Rectangle';
import { Vector2D } from '@/core/tasks/GravitySimulation/geometry/Vector2D';
import type { IBody, Particle } from '@/core/tasks/GravitySimulation/Particle';

export interface IQuadTreeOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class QuadTreeNode {
  public nodes: Array<QuadTreeNode> = [];

  public particles: Array<Particle> = [];

  constructor(
    public bounds: Rectangle,
  ) {}

  static create({ x, y, width, height }: IQuadTreeOptions) {
    return new QuadTreeNode(new Rectangle(x, y, width, height));
  }

  static MAX_PARTICLES = 25;

  static THETA = 1.5;

  get centerOfMass(): IBody {
    const mass = this.particles.length > 0
      ? this.particles.reduce((acc, p) => acc + p.mass, 0)
      : this.nodes.reduce((acc, node) => acc + node.centerOfMass.mass, 0)
    ;
    const position = this.particles.length > 0
      ? this.particles
        .reduce(
          (acc, p) => acc.add(p.position.mult(p.mass)),
          new Vector2D(),
        )
        .div(mass)
      : this.nodes
        .reduce(
          (acc, node) => acc.add(node.centerOfMass.position.mult(node.centerOfMass.mass)),
          new Vector2D(),
        )
        .div(mass)
    ;
    return {
      position,
      mass,
    };
  }

  clear() {
    this.particles = [];
    this.nodes.forEach((node) => { node.clear(); });
    this.nodes = [];
  }

  subdivide() {
    const halfWidth = this.bounds.width / 2;
    const halfHeight = this.bounds.height / 2;
    this.nodes = [
      new QuadTreeNode(new Rectangle(this.bounds.x, this.bounds.y, halfWidth, halfHeight)),
      new QuadTreeNode(new Rectangle(this.bounds.x + halfWidth, this.bounds.y, halfWidth, halfHeight)),
      new QuadTreeNode(new Rectangle(this.bounds.x, this.bounds.y + halfHeight, halfWidth, halfHeight)),
      new QuadTreeNode(new Rectangle(this.bounds.x + halfWidth, this.bounds.y + halfHeight, halfWidth, halfHeight)),
    ];
  }

  private getChildIndex(particle: Particle): number {
    const { center } = this.bounds;
    return (particle.position.x > center.x ? 1 : 0)
      + (particle.position.y > center.y ? 2 : 0)
    ;
  }

  insert(particle: Particle) {
    if (this.nodes.length) {
      const index = this.getChildIndex(particle);

      if (index >= 0) {
        this.nodes[index].insert(particle);
        return;
      }
    }

    this.particles.push(particle);

    if (this.particles.length > QuadTreeNode.MAX_PARTICLES) {
      if (!this.nodes.length) {
        this.subdivide();
      }

      let i = 0;
      while (i < this.particles.length) {
        const index = this.getChildIndex(this.particles[i]);

        if (index >= 0) {
          const [item] = this.particles.splice(i, 1);
          this.nodes[index].insert(item);
        } else {
          i += 1;
        }
      }
    }
  }

  insertAll(particles: Array<Particle>) {
    particles.forEach((particle) => { this.insert(particle); });
  }

  retrieve(particle: Particle): Array<Particle> {
    let particles: Array<Particle> = [];
    const index = this.getChildIndex(particle);

    if (index >= 0 && this.nodes[index]) {
      particles = particles.concat(this.nodes[index].retrieve(particle));
    }

    return particles.concat(this.particles);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.bounds.render(ctx);
    this.nodes.forEach((node) => node.render(ctx));

    if (this.particles.length) {
      ctx.save();
      ctx.fillStyle = '#00f';
      const size = ctx.measureText(this.particles.length.toString());
      ctx.fillText(
        this.particles.length.toString(),
        this.bounds.x + (this.bounds.width / 2) - (size.width / 2),
        this.bounds.y + (this.bounds.height / 2),
        this.bounds.width,
      );
      ctx.beginPath();
      ctx.arc(this.centerOfMass.position.x, this.centerOfMass.position.y, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
  }

  computeGravity() {
    if (this.nodes.length) {
      this.nodes.forEach((node) => node.computeGravity());
    } else {
      const forces = this.particles.map((p1) => this.particles.reduce(
        (acc, p2) => (p1 !== p2 ? acc.add(p1.computeGravitationalForce(p2)) : acc),
        new Vector2D(),
      ));

      this.particles.forEach((p1, i) => {
        p1.applyForce(forces[i]);
      });
    }
  }

  computeCollision() {
    if (this.nodes.length) {
      this.nodes.forEach((node) => {
        node.computeCollision();
      });
    } else {
      this.particles.forEach((p1) => {
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
      });
    }
  }

  removeFarParticles(maxDistance: number) {
    if (this.nodes.length) {
      this.nodes.forEach((node) => {
        node.removeFarParticles(maxDistance);
      });
    } else {
      this.particles
        .filter((p) => p.position.distance(this.centerOfMass.position) >= maxDistance)
        .forEach((p) => {
          this.particles.splice(this.particles.indexOf(p), 1);
        })
      ;
    }
  }

  getParticles(): Array<Particle> {
    if (this.nodes.length) {
      return [
        ...this.particles,
        ...this.nodes.reduce(
          (acc, node) => [...acc, ...node.getParticles()],
          [] as Array<Particle>,
        ),
      ];
    }
    return this.particles;
  }
}
