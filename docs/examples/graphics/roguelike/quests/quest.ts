export class Quest {
  description: string[];
  xpGain: number;

  constructor(description: string[], xpGain: number) {
    this.description = description;
    this.xpGain = xpGain;
  }
}
