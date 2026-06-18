export class Body {
  x: number;
  y: number;

  vx: number;
  vy: number;

  mass: number;

  parent: Body | null = null;

  orbitRadius = 0;
  orbitAngle = 0;
  orbitSpeed = 0;
  lockOrbit = false;
  orbitSpeedScale = 1;
  constructor(
    x: number,
    y: number,
    mass: number,
    vx = 0,
    vy = 0,
    parent: Body | null = null,
  ) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = mass;
    this.parent = parent;
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
