
export class Input {
  down: boolean;
  downCount: number;
  upCount: number;

  constructor() {
    this.down = false;
    this.downCount = 0;
    this.upCount = 0;
  }

  update() {
    if (this.down) {
      this.downCount++;
      this.upCount = 0;
    } else {
      this.downCount = 0;
      this.upCount++;
    }
  }
}
