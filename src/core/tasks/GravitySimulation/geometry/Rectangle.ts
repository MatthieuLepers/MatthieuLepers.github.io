import { Vector2D } from '@/core/tasks/GravitySimulation/geometry/Vector2D';

export class Rectangle {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {
  }

  get minCorner(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  get maxCorner(): Vector2D {
    return new Vector2D(this.x + this.width, this.y + this.height);
  }

  get center(): Vector2D {
    return this.minCorner.add(this.maxCorner).mult(0.5);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.strokeStyle = '#f00';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
