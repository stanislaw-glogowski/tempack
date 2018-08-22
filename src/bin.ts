#!/usr/bin/env node

import { Builder } from "./builder";
import { Cmd } from "./cmd";
import { FS } from "./fs";
import { Logger } from "./logger";

// const { silent, disableColors, ...builderOptions } = new Cmd().parseArgv();
//
// const logger = new Logger({
//   silent,
//   disableColors,
// });
//
// const builder = new Builder(builderOptions, new FS(), logger);
//
// builder
//   .build()
//   .catch(logger.error);

console.log(new Cmd().parseArgv());
