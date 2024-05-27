import { BaseApp } from '../baseapp';
import { Message } from '../message';
import { PointLike } from '../point';
import { Rect } from '../rect';

export interface Component {
  // draw(): void;

  // handleInput(): boolean;

  // close(): void;

  get parent(): Component | undefined;

  set parent(parent: Component | undefined);

  get rect(): Rect;

  get visible(): boolean;

  addChild(panel: Component): void;

  removeChild(panel: Component): void;

  getPanelAt(point: PointLike): Component | undefined;

  handleInput(app: BaseApp): boolean;

  draw(app: BaseApp): void;

  updateTooltip(): Message[] | undefined;

  isDragging(): boolean;

  onDrop(_panel: Component): boolean;
}
