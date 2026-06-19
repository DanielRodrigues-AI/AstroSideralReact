export class GameLoop {
  private lastTime = 0;
  private running = false;
  private frameId: number | null = null;

  private timeScale = 1;
  private paused = false;

  private update: (dt: number) => void;
  private render: () => void;

  constructor(update: (dt: number) => void, render: () => void) {
    this.update = update;
    this.render = render;
  }

  start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  stop(): void {
    this.running = false;

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  pause(): void {
    this.paused = true;
  }

  resume(): void {
    this.paused = false;
    this.lastTime = performance.now();
  }

  togglePause(): void {
    this.paused = !this.paused;
    this.lastTime = performance.now();
  }

  setSpeed(multiplier: 1 | 2 | 5 | 10): void {
    this.timeScale = multiplier;
  }

  getSpeed(): number {
    return this.timeScale;
  }

  isPaused(): boolean {
    return this.paused;
  }

  private loop = (time: number): void => {
    if (!this.running) return;

    const rawDt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // clamp para evitar “explosão” em 10x
    const clampedDt = Math.min(rawDt, 0.033); // ~30 FPS máximo por step

    if (!this.paused) {
      const baseDt = clampedDt * Math.sqrt(this.timeScale);

      const maxStep = 0.016; // ~60 FPS seguro
      const steps = Math.max(1, Math.ceil(baseDt / maxStep));
      const dt = baseDt / steps;

      for (let i = 0; i < steps; i++) {
        this.update(dt);
      }
    }

    this.render();

    this.frameId = requestAnimationFrame(this.loop);
  };
}
