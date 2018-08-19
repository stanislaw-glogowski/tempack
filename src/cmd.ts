#!/usr/bin/env node

import * as program from "commander";
import { Builder, IBuilder } from "./builder";
import logger from "./logger";
import fs from "./fs";

const srcPath = process.cwd();
let distPath: string = null;

program
  .version("1.0.0", "-v, --version")
  .usage("[options] <dist>")
  .arguments("<dist>")
  .option("-c, --config-path [file]", "custom tempack.json file path")
  .option("-p, --package-path [file]", "custom package.json file path")
  .action((arg: string) => {
    if (arg) {
      distPath = arg;
    }
  })
  .parse(process.argv);

const { configPath, packagePath }: {
  configPath: string;
  packagePath: string;
} = program as any;

const builder = new Builder({
  srcPath,
  distPath,
  configPath,
  packagePath,
}, fs, logger);

builder.build();
