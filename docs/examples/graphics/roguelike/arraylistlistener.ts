import { ArrayList } from './arraylist';

export interface ArrayListListener<T> {
  onAdd(array: ArrayList<T>, element: T): void;
  onRemove(array: ArrayList<T>, element: T): void;
}
