import { FS } from "./fs";

describe("FS", () => {

  describe("constructor", () => {

    test("creating FS instance", () => {
      const fs = new FS();

      expect(fs).toBeInstanceOf(FS);
    });
  });
});
