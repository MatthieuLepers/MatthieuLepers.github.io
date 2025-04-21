import { Vector2D } from '@/core/tasks/GravitySimulation/Vector2D';

export interface IParticle {
  position: Vector2D;
  velocity: Vector2D;
  color: string;
  mass: number;
  size: number;
  canvas: HTMLCanvasElement;
}

export const G = 6.67e-4;

export const EPSILON = 1e-5;

export const C = 299_792_458;

const SUN_MASS = 1e5;

const RED_DWARF_MASS = SUN_MASS * 0.08;

const BLACK_HOLE_MIN_MASS = 3 * SUN_MASS;

export class Particle {
  public position: Vector2D;

  public velocity: Vector2D;

  public color: string;

  public strokeColor: string | undefined;

  public mass: number;

  public size: number;

  public canvas: HTMLCanvasElement;

  constructor({ position, velocity, color, mass, size, canvas }: IParticle) {
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.mass = mass;
    this.size = size;
    this.canvas = canvas;
  }

  get isStar() {
    return this.mass >= RED_DWARF_MASS;
  }

  applyForce(f: Vector2D) {
    this.velocity = this.velocity
      .add(f.div(this.mass))
      .clamp(-C, C)
    ;
    this.update();
  }

  computeGravitationalForce(p: Particle): Vector2D {
    const direction = p.position.sub(this.position);
    const dist = Math.max(direction.length(), 1);
    const forceMagnitude = (G * this.mass * p.mass) / (dist ** 2);

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

  becomeRedDwarf() {
    this.size = 3;
    this.color = '#ff4d3b';
  }

  becomeYellowDwarf() {
    this.size = 5;
    this.color = '#ff0';
  }

  becomeBlackHole() {
    this.size = 2;
    this.color = '#000';
    this.strokeColor = '#fff';
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    if (this.strokeColor) ctx.strokeStyle = this.strokeColor;
    ctx.beginPath();
    ctx.ellipse(this.position.x, this.position.y, this.size, this.size, 0, 0, 2 * Math.PI);
    ctx.fill();
    if (this.strokeColor) ctx.stroke();
    ctx.restore();
  }
}
