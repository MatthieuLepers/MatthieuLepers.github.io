function gaussianRandom(mean = 0, stdDev = 1): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); // évite log(0)
  while (v === 0) v = Math.random();
  return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export class Vector2D {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {
  }

  negate() {
    return new Vector2D(-this.x, -this.y);
  }

  add(v: Vector2D) {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector2D) {
    return this.add(v.negate());
  }

  mult(scalar: number) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  div(scalar: number) {
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  clamp(min: number, max: number) {
    return new Vector2D(
      Math.max(min, Math.min(max, this.x)),
      Math.max(min, Math.min(max, this.y)),
    );
  }

  length() {
    return Math.hypot(this.x, this.y);
  }

  normalize() {
    return this.div(this.length());
  }

  distance(v: Vector2D) {
    return Math.hypot(this.x - v.x, this.y - v.y);
  }

  static randomPointAround(pos: Vector2D, r: number) {
    const t = 2 * Math.PI * Math.random();
    const u = Math.sqrt(Math.random()) * r;

    return new Vector2D(
      pos.x + u * Math.cos(t),
      pos.y + u * Math.sin(t),
    );
  }

  static generateGaussianPoint(pos: Vector2D, stdDev: number) {
    return new Vector2D(
      gaussianRandom(pos.x, stdDev),
      gaussianRandom(pos.y, stdDev),
    );
  }

  static generatePoint(width: number, height: number) {
    return new Vector2D(
      Math.random() * width,
      Math.random() * height,
    );
  }
}
