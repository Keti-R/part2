import { describe, test } from "vitest";
import { expect } from "chai";
import { ShuffleBag } from "../src/ShuffleBag.mjs";

describe("Shuffle bag", () => {
  test("returns every value once per bag before starting another bag", () => {
    const values = ["I", "T", "O"];
    const bag = new ShuffleBag(values);
    const first = [bag.next(), bag.next(), bag.next()];
    const second = [bag.next(), bag.next(), bag.next()];

    expect(first.sort()).to.deep.equal(values);
    expect(second.sort()).to.deep.equal(values);
  });
});
