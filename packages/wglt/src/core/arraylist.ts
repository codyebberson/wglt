export interface ArrayListListener<T> {
  onAdd(array: ArrayList<T>, element: T): void;
  onRemove(array: ArrayList<T>, element: T): void;
}

/**
 * A dynamic array implementation with event notification support.
 * Similar to JavaScript's Array but with listener callbacks for add/remove operations.
 * Used internally by WGLT for managing collections like GUI children, entities, etc.
 *
 * @template T - The type of elements stored in the list.
 * @example
 * ```typescript
 * const entities = new ArrayList<Entity>();
 *
 * // Add items
 * entities.add(player);
 * entities.add(monster);
 *
 * // Iterate
 * for (const entity of entities) {
 *   entity.update();
 * }
 *
 * // Access by index
 * const firstEntity = entities.get(0);
 *
 * // Remove items
 * entities.remove(monster);
 *
 * // Listen for changes
 * entities.addListener({
 *   onAdd: (list, item) => console.log('Added:', item),
 *   onRemove: (list, item) => console.log('Removed:', item)
 * });
 * ```
 */
export class ArrayList<T> {
  /** Internal array storage. */
  private readonly elements: T[];
  /** Optional listeners for add/remove events. */
  private listeners?: Array<ArrayListListener<T>>;

  /**
   * Creates a new empty ArrayList.
   */
  constructor() {
    this.elements = [];
  }

  /**
   * The number of elements in the list.
   */
  get length(): number {
    return this.elements.length;
  }

  /**
   * Removes all elements from the list.
   */
  clear(): void {
    this.elements.length = 0;
  }

  /**
   * Gets the element at the specified index.
   * @param index - The index of the element to retrieve.
   * @returns The element at the specified index.
   */
  get(index: number): T {
    return this.elements[index];
  }

  /**
   * Adds an element to the end of the list.
   * Notifies all registered listeners.
   * @param el - The element to add.
   */
  add(el: T): void {
    this.elements.push(el);
    if (this.listeners) {
      for (let i = 0; i < this.listeners.length; i++) {
        this.listeners[i].onAdd(this, el);
      }
    }
  }

  /**
   * Removes the first occurrence of the specified element from the list.
   * Notifies all registered listeners if the element was found.
   * @param el - The element to remove.
   */
  remove(el: T): void {
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

  /**
   * Checks if the list contains the specified element.
   * @param el - The element to search for.
   * @returns True if the element is in the list.
   */
  contains(el: T): boolean {
    return this.elements.indexOf(el) >= 0;
  }

  /**
   * Sorts an array in place.
   * This method mutates the array and returns a reference to the same array.
   * @param compareFn Function used to determine the order of the elements. It is expected to return
   * a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
   * value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order.
   * ```ts
   * [11,2,22,1].sort((a, b) => a - b)
   * ```
   */
  sort(compareFn?: (a: T, b: T) => number): this {
    this.elements.sort(compareFn);
    return this;
  }

  /**
   * Adds a listener to receive notifications when elements are added or removed.
   * @param listener - The listener to add.
   */
  addListener(listener: ArrayListListener<T>): void {
    if (!this.listeners) {
      this.listeners = [];
    }
    this.listeners.push(listener);
  }

  /**
   * Makes the ArrayList iterable with for...of loops.
   * @returns An iterator for the elements.
   */
  [Symbol.iterator](): ArrayIterator<T> {
    return this.elements[Symbol.iterator]();
  }
}
