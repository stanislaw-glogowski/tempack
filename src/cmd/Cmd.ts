import { resolve } from "path";
import * as program from "commander";
import { PACKAGE_FILE_NAME } from "../shared";
import { ICmd } from "./interfaces";
import { TCmdOptions } from "./types";

const DEFAULT_DIST_DIR_NAME = "dist";
const DEFAULT_CONFIG_FILE_NAME = "tempack.json";

/**
 * Cmd
 */
export class Cmd implements ICmd {

  private readonly version: string;
  private readonly options: TCmdOptions;

  /**
   * constructor
   * @param srcPath
   */
  constructor(srcPath: string = process.cwd()) {
    this.options = {
      srcPath,
      distPath: resolve(srcPath, DEFAULT_DIST_DIR_NAME),
      configPath: resolve(srcPath, DEFAULT_CONFIG_FILE_NAME),
      packagePath: resolve(srcPath, PACKAGE_FILE_NAME),
    };

    try {
      const { version } = require(resolve(__dirname, "..", "..", PACKAGE_FILE_NAME)) as {
        version: string;
      };

      this.version = version;
    } catch (err) {
      this.version = "0.0.0";
    }
  }

  /**
   * parses argv
   * @param argv
   */
  public parseArgv(argv: string[] = process.argv): TCmdOptions {
    const result: TCmdOptions = {
      ...this.options,
    };

    const { srcPath } = this.options;

    const {
      args,
      configPath,
      packagePath,
      silent,
      disableColors,
    } = this.program.parse(argv) as any as program.Command & TCmdOptions;

    if (args[ 0 ]) {
      result.distPath = resolve(srcPath, args[ 0 ]);
    }

    if (configPath) {
      result.configPath = resolve(srcPath, configPath);
    }

    if (packagePath) {
      result.packagePath = resolve(srcPath, packagePath);
    }

    result.silent = !!silent;
    result.disableColors = !!disableColors;

    return result;
  }

  private get program(): program.Command {
    return program
      .version(this.version, "-v, --version")
      .usage("[options] <dist>")
      .arguments("<dist>")
      .option("-c, --config-path [path]", "config file path", DEFAULT_CONFIG_FILE_NAME)
      .option("-p, --package-path [path]", "package file path", PACKAGE_FILE_NAME)
      .option("-s, --silent", "turn on silent mode", false)
      .option("--disable-colors", "turn off colors", false);
  }
}
