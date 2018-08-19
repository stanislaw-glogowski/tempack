import { green, cyan, red } from "colors/safe";
import { IBuilderLogger } from "./builder";

/**
 * builder logger instance
 */
const logger: IBuilderLogger = {
  success: (message) => {
    console.log("[", green("success"), "]\t", message);
  },
  info: (message) => {
    console.log("[", cyan("info"), "]\t", message);
  },
  error: (err) => {
    let message: string = "Unknown";
    if (err instanceof Error) {
      message = (err as Error).message;
    }
    console.log("[", red("error"), "]\t", message);
  },
};

export default logger;
