import { describe, test } from "vitest";
import { expect } from "chai";
import { ScoringSystem } from "../src/ScoringSystem.mjs";

describe("Scoring system", () => {
  test("awards more points for clearing more lines", () => {
    const scoring = new ScoringSystem();
    scoring.linesCleared(1);
    scoring.linesCleared(2);

    expect(scoring.score).to.equal(140);
    expect(scoring.lines).to.equal(3);
    expect(scoring.level).to.equal(1);
  });

  test("increases the level every ten lines and applies it to future scores", () => {
    const scoring = new ScoringSystem();
    scoring.linesCleared(4);
    scoring.linesCleared(4);
    scoring.linesCleared(2);
    scoring.linesCleared(1);

    expect(scoring.level).to.equal(2);
    expect(scoring.score).to.equal(780);
  });
});
