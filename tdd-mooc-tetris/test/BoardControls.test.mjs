import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { Board } from "../src/Board.mjs";
import { Tetromino } from "../src/Tetromino.mjs";

describe("Board controls", () => {
  let board;

  beforeEach(() => {
    board = new Board(4, 4);
    board.drop("X");
  });

  test("moves the falling block left, right, and down", () => {
    board.moveLeft();
    board.moveRight();
    board.moveDown();

    expect(board.toString()).to.equalShape(
      `....
       .X..
       ....
       ....`
    );
  });

  test("does not move the falling block beyond the board", () => {
    board.moveLeft();
    board.moveLeft();
    board.moveLeft();
    board.moveRight();
    board.moveRight();
    board.moveRight();

    expect(board.toString()).to.equalShape(
      `...X
       ....
       ....
       ....`
    );
  });

  test("stops falling at the bottom of the board", () => {
    board.moveDown();
    board.moveDown();
    board.moveDown();
    board.moveDown();

    expect(board.toString()).to.equalShape(
      `....
       ....
       ....
       .X..`
    );
    expect(board.hasFalling()).to.be.false;
  });

  test("does not move through another block", () => {
    board.cells[0][0] = "Y";
    board.moveLeft();

    expect(board.toString()).to.equalShape(
      `YX..
       ....
       ....
       ....`
    );
  });

  test("rotates the falling tetromino", () => {
    const rotatingBoard = new Board(6, 6);
    rotatingBoard.drop(Tetromino.T_SHAPE);
    rotatingBoard.rotateRight();

    expect(rotatingBoard.toString()).to.equalShape(
      `...T..
       ..TT..
       ...T..
       ......
       ......
       ......`
    );
  });

  test("kicks a tetromino sideways when rotation is blocked", () => {
    const rotatingBoard = new Board(5, 6);
    rotatingBoard.drop(Tetromino.T_SHAPE);
    rotatingBoard.cells[2][3] = "Y";
    rotatingBoard.rotateRight();

    expect(rotatingBoard.toString()).to.equalShape(
      `....T
       ...TT
       ...YT
       .....
       .....
       .....`
    );
  });

  test("does not rotate when no valid position is available", () => {
    const rotatingBoard = new Board(5, 5);
    rotatingBoard.drop(Tetromino.T_SHAPE);
    rotatingBoard.cells = rotatingBoard.cells.map(() => Array(5).fill("Y"));
    const before = rotatingBoard.toString();
    rotatingBoard.rotateRight();

    expect(rotatingBoard.toString()).to.equal(before);
  });

  test("the I tetromino does not use a wall kick", () => {
    const rotatingBoard = new Board(6, 6);
    rotatingBoard.drop(Tetromino.I_SHAPE);
    rotatingBoard.cells[0][2] = "Y";
    const before = rotatingBoard.toString();
    rotatingBoard.rotateRight();

    expect(rotatingBoard.toString()).to.equal(before);
  });

  test("clears a completed line and reports the number of lines", () => {
    const lineBoard = new Board(4, 2);
    const cleared = [];
    lineBoard.onClearLine = (count) => cleared.push(count);
    lineBoard.cells[1] = ["Y", ".", "Y", "Y"];
    lineBoard.drop("X");
    lineBoard.tick();
    lineBoard.tick();

    expect(lineBoard.toString()).to.equalShape(
      `....
       ....`
    );
    expect(cleared).to.deep.equal([1]);
  });
});
