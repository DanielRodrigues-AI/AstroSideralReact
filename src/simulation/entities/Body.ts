export class Body {
  x: number;
  y: number;

  vx: number;
  vy: number;

  mass: number;
  radius: number;
  renderRadius: number;

  parent: Body | null = null;

  orbitRadius = 0;
  orbitAngle = 0;
  orbitSpeed = 0;
  orbitSpeedScale = 1;
  constructor(
    x: number,
    y: number,
    mass: number,
    vx = 0,
    vy = 0,
    parent: Body | null = null,
    radius?: number,
    renderRadius?: number,
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;
    this.parent = parent;

    this.radius =
      radius ?? (mass > 6000 ? 16 : mass > 1000 ? 10 : mass > 3 ? 4 : 2);
    this.renderRadius = renderRadius ?? this.radius;
  }
  ax = 0;
  ay = 0;

  previousAx = 0;
  previousAy = 0;

  applyForce(fx: number, fy: number) {
    this.ax += fx / this.mass;
    this.ay += fy / this.mass;
  }

  update(deltaTime: number) {
    this.vx *= 0.999;
    this.vy *= 0.999;

    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
  }
}
