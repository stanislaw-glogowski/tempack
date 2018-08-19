import { green, cyan, red } from "colors/safe";
import { IBuilderLogger } from "./builder";

const print = (prefix, message) => {
  console.log(`[ ${prefix} ] ${message}`);
};

/**
 * builder logger instance
 */
const logger: IBuilderLogger = {
  success: (message) => print(green("tempack:success"), message),
  info: (message) => print(cyan("tempack:info"), message),
  error: (err) => {
    let message: string = "Unknown";
    if (err instanceof Error) {
      message = (err as Error).message;
    }
    print(red("tempack:error"), message);
  },
};

export default logger;
