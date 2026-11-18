export class ShuffleBag {
  values;
  bag = [];

  constructor(values) {
    if (values.length === 0) throw new Error("shuffle bag must not be empty");
    this.values = [...values];
  }

  next() {
    if (this.bag.length === 0) {
      this.bag = [...this.values];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
    return this.bag.pop();
  }
}
