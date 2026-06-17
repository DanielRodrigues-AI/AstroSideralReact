export class Camera {
  x = 0;
  y = 0;

  zoom = 1;

  viewportWidth = 0;
  viewportHeight = 0;

  worldToScreenX(x: number): number {
    return (
      (x - this.x) * this.zoom +
      this.viewportWidth / 2
    );
  }

  worldToScreenY(y: number): number {
    return (
      (y - this.y) * this.zoom +
      this.viewportHeight / 2
    );
  }
}