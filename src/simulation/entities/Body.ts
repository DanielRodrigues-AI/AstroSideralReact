export class Body {
  x: number;
  y: number;

  vx: number;
  vy: number;

  mass: number;

  constructor(x: number, y: number, mass: number, vx = 0, vy = 0) {
    this.x = x;
    this.y = y;

    this.vx = vx;
    this.vy = vy;

    this.mass = mass;
  }

  private ax = 0;
  private ay = 0;

  applyForce(fx: number, fy: number) {
    this.ax += fx / this.mass;
    this.ay += fy / this.mass;
  }

  integrate(dt: number) {
    const ax = this.ax;
    const ay = this.ay;

    this.vx += ax * dt;
    this.vy += ay * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.ax = 0;
    this.ay = 0;
    
    this.vx *= 1;
    this.vy *= 1;
  }

  update(deltaTime: number) {
    this.vx *= 0.999; // leve damping pra estabilidade numérica
    this.vy *= 0.999;

    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
  }
}
