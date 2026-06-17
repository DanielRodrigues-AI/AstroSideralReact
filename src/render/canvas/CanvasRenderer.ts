import { Body } from "../../simulation/entities/Body";
import { Camera } from "./Camera";
import { SelectionManager } from "../../simulation/selection/SelectionManager";

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private bodies: Body[];
  private camera: Camera;
  private selectionManager: SelectionManager;

  constructor(
    ctx: CanvasRenderingContext2D,
    bodies: Body[],
    camera: Camera,
    selectionManager: SelectionManager,
  ) {
    this.ctx = ctx;
    this.bodies = bodies;
    this.camera = camera;
    this.selectionManager = selectionManager;
  }

  render(): void {
    const canvas = this.ctx.canvas;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const b of this.bodies) {
      this.ctx.beginPath();
      const x = this.camera.worldToScreenX(b.x);
const y = this.camera.worldToScreenY(b.y);

this.ctx.arc(
  x,
  y,
  (b.mass > 1000 ? 12 : 4) * this.camera.zoom,
  0,
  Math.PI * 2,
);
      this.ctx.fillStyle = b.mass > 1000 ? "#ffaa00" : "#66ccff";
      this.ctx.fill();
      if (this.selectionManager.getSelected() === b) {
  this.ctx.beginPath();

  this.ctx.arc(
    x,
    y,
    ((b.mass > 1000 ? 12 : 4) + 6) * this.camera.zoom,
    0,
    Math.PI * 2,
  );

  this.ctx.strokeStyle = "#ffffff";
  this.ctx.lineWidth = 2;
  this.ctx.stroke();
}
    }
  }
}
