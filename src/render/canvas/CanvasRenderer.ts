import { Body } from "../../simulation/entities/Body";
import { Camera } from "./Camera";
import { SelectionManager } from "../../simulation/selection/SelectionManager";
import { TrailManager } from "../../simulation/trails/TrailManager";

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private bodies: Body[];
  private camera: Camera;
  private selectionManager: SelectionManager;
  private trailManager: TrailManager;

  constructor(
    ctx: CanvasRenderingContext2D,
    bodies: Body[],
    camera: Camera,
    selectionManager: SelectionManager,
    trailManager: TrailManager,
  ) {
    this.ctx = ctx;
    this.bodies = bodies;
    this.camera = camera;
    this.selectionManager = selectionManager;
    this.trailManager = trailManager;
  }

  render(): void {
    const canvas = this.ctx.canvas;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.renderTrails();
    for (const b of this.bodies) {
      this.ctx.beginPath();
      const x = this.camera.worldToScreenX(b.x);
      const y = this.camera.worldToScreenY(b.y);

      this.ctx.arc(x, y, b.renderRadius * this.camera.zoom, 0, Math.PI * 2);

      this.ctx.fillStyle =
        b.mass > 6000
          ? "#ffcc55" // sol
          : b.mass > 3
            ? "#66ccff" // planeta
            : "#aaaaaa"; // lua
      this.ctx.fill();
      if (this.selectionManager.getSelected() === b) {
        this.ctx.beginPath();

        this.ctx.arc(
          x,
          y,
          (b.renderRadius + 6) * this.camera.zoom,
          0,
          Math.PI * 2,
        );

        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
    }
  }
  private renderTrails(): void {
    this.ctx.strokeStyle = "rgba(255,255,255,0.25)";
    this.ctx.lineWidth = 1;

    for (const body of this.bodies) {
      const trail = this.trailManager.getTrail(body);

      if (trail.length < 2) continue;

      this.ctx.beginPath();

      for (let i = 0; i < trail.length; i++) {
        const x = this.camera.worldToScreenX(trail[i].x);
        const y = this.camera.worldToScreenY(trail[i].y);

        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.stroke();
    }
  }
}
