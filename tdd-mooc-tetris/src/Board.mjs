import { RotatingShape } from "./RotatingShape.mjs";

export class Board {
  width;
  height;
  cells;
  falling = null;
  onClearLine = () => {};

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = Array.from({ length: height }, () => Array(width).fill("."));
  }

  toString() {
    return this.cells
      .map((row, y) => row.map((cell, x) => (this._fallingCellAt(y, x) || cell)).join(""))
      .join("\n") + "\n";
  }

  cellAt(row, column) {
    return this._fallingCellAt(row, column) || this.cells[row][column];
  }

  drop(block) {
    if (this.hasFalling()) throw new Error("already falling");
    const shape = typeof block === "string" ? RotatingShape.fromString(block) : block;
    const x = Math.floor((this.width - shape.width) / 2);
    if (!this._canPlace(shape, x, 0)) throw new Error("cannot drop");
    this.falling = { shape, x, y: 0 };
  }

  hasFalling() {
    return this.falling !== null;
  }

  tick() {
    this.moveDown();
  }

  moveDown() {
    if (!this.falling) return;
    if (!this._canPlace(this.falling.shape, this.falling.x, this.falling.y + 1)) {
      this._land();
    } else {
      this.falling.y++;
    }
  }

  moveLeft() {
    this._move(-1, 0);
  }

  moveRight() {
    this._move(1, 0);
  }

  rotateLeft() {
    this._rotate("rotateLeft");
  }

  rotateRight() {
    this._rotate("rotateRight");
  }

  _move(dx, dy) {
    if (!this.falling) return;
    const { shape, x, y } = this.falling;
    if (this._canPlace(shape, x + dx, y + dy)) {
      this.falling.x += dx;
      this.falling.y += dy;
    } else if (dy > 0) {
      this._land();
    }
  }

  _rotate(direction) {
    if (!this.falling) return;
    const rotated = this.falling.shape[direction]();
    const kicks = [[0, 0]];
    if (this.falling.shape.allowKick !== false) kicks.push([1, 0], [-1, 0]);
    for (const [dx, dy] of kicks) {
      if (this._canPlace(rotated, this.falling.x + dx, this.falling.y + dy)) {
        this.falling.shape = rotated;
        this.falling.x += dx;
        this.falling.y += dy;
        return;
      }
    }
  }

  _canPlace(shape, x, y) {
    const rows = shape.toString().trim().split("\n");
    for (let row = 0; row < shape.height; row++) {
      for (let column = 0; column < shape.width; column++) {
        if (rows[row][column] === ".") continue;
        const boardX = x + column;
        const boardY = y + row;
        if (
          boardX < 0 ||
          boardX >= this.width ||
          boardY < 0 ||
          boardY >= this.height ||
          this.cells[boardY][boardX] !== "."
        ) {
          return false;
        }
      }
    }
    return true;
  }

  _fallingCellAt(row, column) {
    if (!this.falling) return null;
    const { shape, x, y } = this.falling;
    const localX = column - x;
    const localY = row - y;
    if (localX < 0 || localX >= shape.width || localY < 0 || localY >= shape.height) return null;
    const value = shape.toString().trim().split("\n")[localY][localX];
    return value === "." ? null : value;
  }

  _land() {
    const { shape, x, y } = this.falling;
    const rows = shape.toString().trim().split("\n");
    for (let row = 0; row < shape.height; row++) {
      for (let column = 0; column < shape.width; column++) {
        if (rows[row][column] !== ".") this.cells[y + row][x + column] = rows[row][column];
      }
    }
    this.falling = null;
    this._clearLines();
  }

  _clearLines() {
    const remaining = this.cells.filter((row) => row.includes("."));
    const cleared = this.height - remaining.length;
    if (cleared === 0) return;
    this.cells = [...Array.from({ length: cleared }, () => Array(this.width).fill(".")), ...remaining];
    this.onClearLine(cleared);
  }
}
