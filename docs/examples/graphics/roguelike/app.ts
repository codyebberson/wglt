import { GraphicsApp, GraphicsAppConfig, Point } from 'wglt';

export class App extends GraphicsApp {
  readonly center: Point;

  constructor(options: GraphicsAppConfig) {
    super(options);
    this.center = new Point((this.size.width / 2) | 0, (this.size.height / 2) | 0);
  }
}
