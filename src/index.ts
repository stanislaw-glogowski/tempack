#!/usr/bin/env node

import * as program from "commander";
import { Runner } from "./runner";

interface IProgram {
  configFile?: string;
  packageFile?: string;
}

let distPath: string = "";

program
  .version("0.0.1")
  .usage("[options] <dist>")
  .arguments("<dist>")
  .option("-c, --config-file [file]", "custom tempack.json file")
  .option("-p, --package-file [file]", "custom package.json file")
  .action((arg: string) => {
    distPath = arg;
  })
  .parse(process.argv);

if (!distPath) {
  program.help();
  process.exit(0);
}

const {packageFile, configFile} = program as IProgram;

const runner = new Runner({
  workingPath: process.cwd(),
  distPath,
  configFile,
  packageFile,
});

runner
  .setup()
  .run()
  .catch(console.error);
