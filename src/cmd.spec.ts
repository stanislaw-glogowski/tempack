import { resolve } from "path";
import { Cmd, ICmd } from "./cmd";

describe("Cmd", () => {

  describe("constructor", () => {

    test("creating Cmd instance", () => {
      const cmd = new Cmd("/");
      expect(cmd).toBeInstanceOf(Cmd);
    });
  });

  describe(".parseArgv()", () => {
    let cmd: ICmd;

    const WORKING_PATH = "/root/path";

    beforeAll(() => {
      cmd = new Cmd(WORKING_PATH);
    });

    test("default values", () => {
      const options = cmd.parseArgv([
        "$0",
        "$1",
      ]);

      expect(options.srcPath).toEqual(WORKING_PATH);
      expect(options.distPath).toEqual(resolve(WORKING_PATH, "dist"));
      expect(options.configPath).toEqual(resolve(WORKING_PATH, "tempack.json"));
      expect(options.packagePath).toEqual(resolve(WORKING_PATH, "package.json"));
      expect(options.silent).toEqual(false);
      expect(options.disableColors).toEqual(false);
    });

    test("boolean args", () => {
      const options = cmd.parseArgv([
        "$0",
        "$1",
        "-s",
        "--disable-colors",
      ]);

      expect(options.silent).toEqual(true);
      expect(options.disableColors).toEqual(true);
    });

    test("args with relatives paths", () => {
      const options = cmd.parseArgv([
        "$0",
        "$1",
        "-c",
        "../config",
        "-p",
        "../package",
        "../dist",
      ]);

      expect(options.distPath).toEqual(resolve(WORKING_PATH, "../dist"));
      expect(options.configPath).toEqual(resolve(WORKING_PATH, "../config"));
      expect(options.packagePath).toEqual(resolve(WORKING_PATH, "../package"));
    });

    test("args with absolute paths", () => {
      const options = cmd.parseArgv([
        "$0",
        "$1",
        "-c",
        "/config",
        "-p",
        "/package",
        "/dist",
      ]);

      expect(options.distPath).toEqual("/dist");
      expect(options.configPath).toEqual("/config");
      expect(options.packagePath).toEqual("/package");
    });
  });
});
