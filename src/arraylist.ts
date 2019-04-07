import {ArrayListListener} from './arraylistlistener';
import { Serializable } from './serializable';

@Serializable('ArrayList')
export class ArrayList<T> {
  private readonly elements: T[];
  private listeners?: Array<ArrayListListener<T>>;

  constructor() {
    this.elements = [];
  }

  get length() {
    return this.elements.length;
  }

  clear() {
    this.elements.splice(0, this.elements.length);
  }

  get(index: number) {
    return this.elements[index];
  }

  add(el: T) {
    this.elements.push(el);
    if (this.listeners) {
      for (let i = 0; i < this.listeners.length; i++) {
        this.listeners[i].onAdd(this, el);
      }
    }
  }

  remove(el: T) {
    const index = this.elements.indexOf(el);
    if (index >= 0) {
      this.elements.splice(index, 1);
      if (this.listeners) {
        for (let i = 0; i < this.listeners.length; i++) {
          this.listeners[i].onRemove(this, el);
        }
      }
    }
  }

  contains(el: T) {
    return this.elements.indexOf(el) >= 0;
  }

  addListener(listener: ArrayListListener<T>) {
    if (!this.listeners) {
      this.listeners = [];
    }
    this.listeners.push(listener);
  }
}