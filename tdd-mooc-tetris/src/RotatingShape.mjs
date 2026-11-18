export class RotatingShape {
  rows;
  width;
  height;

  constructor(rows) {
    this.rows = rows.map((row) => Object.freeze([...row]));
    Object.freeze(this.rows);
    this.height = this.rows.length;
    this.width = this.rows[0].length;
    Object.freeze(this);
  }

  static fromString(shape) {
    const rows = shape
      .trim()
      .split("\n")
      .map((row) => row.trim());
    if (!rows[0] || rows.some((row) => row.length !== rows[0].length)) {
      throw new Error("shape must be a non-empty rectangle");
    }
    return new RotatingShape(rows);
  }

  toString() {
    return this.rows.map((row) => row.join("")).join("\n") + "\n";
  }

  rotateRight() {
    const rotated = Array.from({ length: this.width }, () => Array(this.height));
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) rotated[x][this.height - y - 1] = this.rows[y][x];
    }
    return new RotatingShape(rotated);
  }

  rotateLeft() {
    const rotated = Array.from({ length: this.width }, () => Array(this.height));
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) rotated[this.width - x - 1][y] = this.rows[y][x];
    }
    return new RotatingShape(rotated);
  }
}
