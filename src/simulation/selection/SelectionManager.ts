import { Body } from "../entities/Body";

export class SelectionManager {
  private selectedBody: Body | null = null;

  select(body: Body): void {
    this.selectedBody = body;
  }

  clear(): void {
    this.selectedBody = null;
  }

  getSelected(): Body | null {
    return this.selectedBody;
  }
}