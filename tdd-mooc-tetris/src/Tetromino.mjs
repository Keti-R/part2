import { RotatingShape } from "./RotatingShape.mjs";

function twoOrientations(shape) {
  const first = RotatingShape.fromString(shape);
  return [first, first.rotateRight()];
}

export class Tetromino {
  shape;
  width;
  height;
  rotations;
  orientation;
  allowKick;

  constructor(shape, rotations, orientation = 0, allowKick = true) {
    this.shape = typeof shape === "string" ? RotatingShape.fromString(shape) : shape;
    this.rotations = rotations || [
      this.shape,
      this.shape.rotateRight(),
      this.shape.rotateRight().rotateRight(),
      this.shape.rotateLeft(),
    ];
    this.orientation = orientation;
    this.width = this.shape.width;
    this.height = this.shape.height;
    this.allowKick = allowKick;
    Object.freeze(this.rotations);
    Object.freeze(this);
  }

  toString() {
    return this.shape.toString();
  }

  rotateRight() {
    return this._rotate(1);
  }

  rotateLeft() {
    return this._rotate(-1);
  }

  _rotate(direction) {
    if (this.rotations.length === 1) return this;
    const orientation = (this.orientation + direction + this.rotations.length) % this.rotations.length;
    return new Tetromino(this.rotations[orientation], this.rotations, orientation, this.allowKick);
  }
}

Tetromino.T_SHAPE = new Tetromino(
  `TTT
   .T.
   ...`
);
Tetromino.I_SHAPE = new Tetromino(
  `.....
   .....
   IIII.
   .....
   .....`,
  [
    RotatingShape.fromString(
      `.....
       .....
       IIII.
       .....
       .....`
    ),
    RotatingShape.fromString(
      `..I..
       ..I..
       ..I..
       ..I..
       .....`
    ),
  ],
  0,
  false
);
Tetromino.L_SHAPE = new Tetromino(
  `LLL
   ..L
   ...`
);
Tetromino.J_SHAPE = new Tetromino(
  `JJJ
   J..
   ...`
);
Tetromino.S_SHAPE = new Tetromino(
  RotatingShape.fromString(
    `.SS
     SS.
     ...`
  ),
  twoOrientations(
    `.SS
     SS.
     ...`
  )
);
Tetromino.Z_SHAPE = new Tetromino(
  RotatingShape.fromString(
    `ZZ.
     .ZZ
     ...`
  ),
  twoOrientations(
    `ZZ.
     .ZZ
     ...`
  )
);
Tetromino.O_SHAPE = new Tetromino(
  RotatingShape.fromString(
    `.OO
     .OO
     ...`
  ),
  [
    RotatingShape.fromString(
      `.OO
       .OO
       ...`
    ),
  ]
);
