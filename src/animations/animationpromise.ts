
export class AnimationPromise {
  readonly handlers: Function[];

  constructor() {
    this.handlers = [];
  }

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
