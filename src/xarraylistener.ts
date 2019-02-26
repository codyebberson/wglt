import {XArray} from './xarray';

export interface XArrayListener<T> {
  onAdd(array: XArray<T>, element: T): void;
  onRemove(array: XArray<T>, element: T): void;
}
