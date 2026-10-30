import type { IBody, Particle } from '../Particle';
import { Rectangle } from './Rectangle';
import { Vector2D } from './Vector2D';

export interface IQuadTreeOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class QuadTreeNode {
  public nodes: Array<QuadTreeNode> = [];

  public particles: Array<Particle> = [];

  private totalMass = 0;

  private massCenter = new Vector2D();

  constructor(
    public bounds: Rectangle,
    public depth: number = 0,
  ) {}

  static create({ x, y, width, height }: IQuadTreeOptions) {
    return new QuadTreeNode(new Rectangle(x, y, width, height));
  }

  static MAX_PARTICLES = 25;

  static MAX_DEPTH = 8;

  static THETA = 0.5;

  get centerOfMass(): IBody {
    return {
      position: this.massCenter,
      mass: this.totalMass,
    };
  }

  clear() {
    this.particles = [];
    this.nodes.forEach((node) => { node.clear(); });
    this.nodes = [];
    this.totalMass = 0;
    this.massCenter = new Vector2D();
  }

  subdivide() {
    const { x, y, width, height } = this.bounds;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    this.nodes = [
      new QuadTreeNode(new Rectangle(x, y, halfWidth, halfHeight), this.depth + 1),
      new QuadTreeNode(new Rectangle(x + halfWidth, y, halfWidth, halfHeight), this.depth + 1),
      new QuadTreeNode(new Rectangle(x, y + halfHeight, halfWidth, halfHeight), this.depth + 1),
      new QuadTreeNode(new Rectangle(x + halfWidth, y + halfHeight, halfWidth, halfHeight), this.depth + 1),
    ];
  }

  private getChildIndex(p: Particle): number | -1 {
    const { center } = this.bounds;

    if (p.position.x === center.x || p.position.y === center.y) {
      return -1;
    }

    return (p.position.x > center.x ? 1 : 0) + (p.position.y > center.y ? 2 : 0);
  }

  insert(particle: Particle) {
    if (this.nodes.length) {
      const index = this.getChildIndex(particle);
      if (index !== -1) {
        this.nodes[index].insert(particle);
        return;
      }
    }

    this.particles.push(particle);

    if (this.particles.length > QuadTreeNode.MAX_PARTICLES && this.depth < QuadTreeNode.MAX_DEPTH) {
      if (!this.nodes.length) {
        this.subdivide();
      }

      const oldParticles = this.particles;
      this.particles = [];

      for (let i = 0; i < oldParticles.length; i += 1) {
        const p = oldParticles[i];
        const index = this.getChildIndex(p);
        if (index === -1) {
          this.particles.push(p);
        } else {
          this.nodes[index].insert(p);
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

  /**
   * Recomputes mass and center of mass from the leaves to the root.
   * Must run after insertion and before a Barnes-Hut traversal.
   */
  updateMassDistribution(): IBody {
    let mass = 0;
    let weightedPosition = new Vector2D();

    this.particles.forEach((particle) => {
      mass += particle.mass;
      weightedPosition = weightedPosition.add(particle.position.mult(particle.mass));
    });

    this.nodes.forEach((node) => {
      const aggregate = node.updateMassDistribution();
      mass += aggregate.mass;
      weightedPosition = weightedPosition.add(aggregate.position.mult(aggregate.mass));
    });

    this.totalMass = mass;
    this.massCenter = mass > 0 ? weightedPosition.div(mass) : new Vector2D();

    return this.centerOfMass;
  }

  private computeGravityForParticle(particle: Particle, theta: number): Vector2D {
    let force = new Vector2D();

    // Particles retained directly in an internal node (e.g. on a split line)
    // are always evaluated exactly.
    this.particles.forEach((other) => {
      if (particle !== other) {
        force = force.add(particle.computeGravitationalForce(other));
      }
    });

    if (!this.nodes.length) {
      return force;
    }

    const targetChildIndex = this.getChildIndex(particle);

    this.nodes.forEach((node, index) => {
      if (index === targetChildIndex) {
        // Never approximate a subtree containing the target particle.
        force = force.add(node.computeGravityForParticle(particle, theta));
        return;
      }

      const distance = node.massCenter.distance(particle.position);
      const size = Math.max(node.bounds.width, node.bounds.height);
      const canApproximate = node.totalMass > 0
        && distance > 0
        && size / distance < theta;

      if (canApproximate) {
        force = force.add(particle.computeGravitationalForce({
          position: node.massCenter,
          mass: node.totalMass,
        }));
      } else {
        force = force.add(node.computeGravityForParticle(particle, theta));
      }
    });

    return force;
  }

  computeGravity(theta: number = QuadTreeNode.THETA) {
    // Aggregate once for the whole tree, then calculate every force against
    // the same, unchanged particle positions.
    this.updateMassDistribution();

    const particles = this.getParticles();
    const forces = particles.map((particle) => this.computeGravityForParticle(particle, theta));

    // Applying forces moves particles, so do it only after all forces exist.
    particles.forEach((particle, index) => {
      particle.applyForce(forces[index]);
    });
  }

  computeCollision() {
    if (this.nodes.length) {
      this.nodes.forEach((node) => {
        node.computeCollision();
      });
      return;
    }

    // Keep the collision scope local to this leaf, but never mutate an array
    // while iterating it with forEach.
    let i = 0;
    while (i < this.particles.length) {
      let j = i + 1;

      while (j < this.particles.length) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        if (!p1.collideWith(p2)) {
          j += 1;
          continue;
        }

        if (p1.mass > p2.mass) {
          p1.mergeWith(p2);
        } else {
          p2.mergeWith(p1);
          this.particles[i] = p2;
        }

        this.particles.splice(j, 1);
      }

      i += 1;
    }
  }

  private removeFarParticlesFromLeaves(maxDistance: number) {
    if (this.nodes.length) {
      this.nodes.forEach((node) => {
        node.removeFarParticlesFromLeaves(maxDistance);
      });
      return;
    }

    this.particles
      .filter((particle) => particle.position.distance(this.massCenter) >= maxDistance)
      .forEach((particle) => {
        this.particles.splice(this.particles.indexOf(particle), 1);
      })
    ;
  }

  removeFarParticles(maxDistance: number) {
    // Refresh aggregates after collisions before using each leaf's local COM.
    this.updateMassDistribution();
    this.removeFarParticlesFromLeaves(maxDistance);
    this.updateMassDistribution();
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
