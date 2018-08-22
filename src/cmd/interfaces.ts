import { TCmdOptions } from "./types";

export interface ICmd {
  parseArgv(argv?: string[]): TCmdOptions;
}
