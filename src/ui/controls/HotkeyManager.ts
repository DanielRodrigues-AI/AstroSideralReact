type HotkeyAction = () => void;

export class HotkeyManager {
  private keyMap = new Map<string, HotkeyAction>();

  constructor() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  bind(key: string, action: HotkeyAction): void {
    this.keyMap.set(key.toLowerCase(), action);
  }

  unbind(key: string): void {
    this.keyMap.delete(key.toLowerCase());
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    const action = this.keyMap.get(key);

    if (!action) return;

    action();
  };

  destroy(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    this.keyMap.clear();
  }
}