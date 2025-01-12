export class AnimationPromise {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  readonly handlers: Function[];

  constructor() {
    this.handlers = [];
  }

  // biome-ignore lint/suspicious/noThenProperty: <explanation>
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  then(handler: Function) {
    this.handlers.push(handler);
    return this;
  }

  resolve() {
    for (let i = 0; i < this.handlers.length; i++) {
      this.handlers[i]();
    }
  }
}
