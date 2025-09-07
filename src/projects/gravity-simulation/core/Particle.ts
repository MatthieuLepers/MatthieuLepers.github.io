import { findAchievement } from '@/core/Achievement';
import { Vector2D } from './geometry/Vector2D';

export interface IBody {
  position: Vector2D;
  mass: number;
}

export interface IParticle extends IBody {
  velocity: Vector2D;
  color: string;
  size: number;
  canvas: HTMLCanvasElement;
  type?: ParticleType;
  draw?: (ctx: CanvasRenderingContext2D, particle: Particle) => void;
}

export enum ParticleType {
  PARTICLE = 0,
  STAR = 1,
  BLACK_HOLE = 2,
}

export const G = 6.67e-5;

export const EPSILON = 1e-5;

export const C = 10;

const SUN_MASS = 1e5;

const RED_DWARF_MASS = SUN_MASS * 0.08;

const BLACK_HOLE_MIN_MASS = 3 * SUN_MASS;

export const DRAW = {
  PARTICLE: (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.fillStyle = particle.color;
    particle.drawArc.call(particle, ctx);
  },
  STAR: (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.fillStyle = particle.getRadialGradient(ctx);
    particle.drawArc(ctx);
  },
  BLACK_HOLE: (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.strokeStyle = particle.strokeColor!;
    ctx.fillStyle = particle.color;
    particle.drawArc(ctx);
    ctx.stroke();
  },
};

export class Particle {
  public position: Vector2D;

  public velocity: Vector2D;

  public color: string;

  public strokeColor: string | undefined;

  public mass: number;

  public size: number;

  public canvas: HTMLCanvasElement;

  public type: ParticleType = ParticleType.PARTICLE;

  public draw: (ctx: CanvasRenderingContext2D, particle: Particle) => void;

  constructor({
    position,
    velocity,
    color,
    mass,
    size,
    canvas,
    type = ParticleType.PARTICLE,
    draw = DRAW.PARTICLE,
  }: IParticle) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.mass = mass;
    this.size = size;
    this.canvas = canvas;
    this.type = type;
    this.draw = draw;
  }

  get isStar() {
    return this.type !== ParticleType.PARTICLE;
  }

  applyForce(f: Vector2D) {
    this.velocity = this.velocity
      .add(f.div(this.mass))
      .clamp(-C, C)
    ;
    this.update();
  }

  computeGravitationalForce(body: IBody): Vector2D {
    const direction = body.position.sub(this.position);
    const dist = Math.max(direction.length(), 0.1);
    const forceMagnitude = (G * this.mass * body.mass) / (dist ** 2);

    return direction.normalize().mult(forceMagnitude);
  }

  collideWith(p: Particle): boolean {
    return this.position.distance(p.position) < this.size + p.size;
  }

  mergeWith(p: Particle) {
    const newMass = this.mass + p.mass;
    this.position = new Vector2D(
      (this.position.x * this.mass + p.position.x * p.mass) / newMass,
      (this.position.y * this.mass + p.position.y * p.mass) / newMass,
    );
    this.velocity = new Vector2D(
      (this.velocity.x * this.mass + p.velocity.x * p.mass) / newMass,
      (this.velocity.y * this.mass + p.velocity.y * p.mass) / newMass,
    );
    this.mass += p.mass;

    if (this.mass >= RED_DWARF_MASS && this.mass < SUN_MASS) {
      this.becomeRedDwarf();
    }

    if (this.mass >= SUN_MASS && this.mass < BLACK_HOLE_MIN_MASS) {
      this.becomeYellowDwarf();
    }

    if (this.mass >= BLACK_HOLE_MIN_MASS) {
      if (!this.strokeColor) {
        this.becomeBlackHole();
      } else {
        this.size += Math.cbrt(p.size) / p.mass;

        if (this.size >= this.canvas.height - 20) {
          findAchievement('Gravity simulation', 'gargantua')?.acquire();
        }
      }
    }
  }

  private update() {
    this.position = this.position.add(this.velocity);

    if (this.isStar) {
      if (this.position.x - this.size < 0 || this.position.x + this.size > this.canvas.width) {
        this.velocity.x *= -0.01;
        this.position.x = Math.max(this.size, Math.min(this.canvas.width - this.size, this.position.x));
      }

      if (this.position.y - this.size < 0 || this.position.y + this.size > this.canvas.height) {
        this.velocity.y *= -0.01;
        this.position.y = Math.max(this.size, Math.min(this.canvas.height - this.size, this.position.y));
      }
    }
  }

  getRadialGradient(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(this.position.x, this.position.y, 0, this.position.x, this.position.y, this.size * 2);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');

    return gradient;
  }

  drawArc(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  becomeRedDwarf() {
    if (this.color !== '#ff4d3b') {
      this.type = ParticleType.STAR;
      this.size = 3;
      this.color = '#ff4d3b';
      this.draw = DRAW.STAR;
      findAchievement('Gravity simulation', 'red_dwarf')?.acquire();
    }
  }

  becomeYellowDwarf() {
    if (this.color !== '#ff0') {
      this.size = 5;
      this.color = '#ff0';
      this.draw = DRAW.STAR;
      findAchievement('Gravity simulation', 'yellow_dwarf')?.acquire();
    }
  }

  becomeBlackHole() {
    if (this.color !== '#000') {
      this.size = 2;
      this.color = '#000';
      this.strokeColor = '#fff';
      this.draw = DRAW.BLACK_HOLE;
      findAchievement('Gravity simulation', 'black_hole')?.acquire();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.draw(ctx, this);
    ctx.restore();
  }
}
