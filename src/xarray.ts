
export class XArray<T> extends Array<T> {
  remove(el: T) {
    const index = this.indexOf(el);
    if (index >= 0) {
      this.splice(index, 1);
    }
  }
}