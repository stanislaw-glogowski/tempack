import { green, cyan, red } from "colors/safe";
import { IBuilderLogger } from "./builder";

const PREFIX = "tempack";
const PADDING_BASE = 8;

const print = (color: (value: string) => string, type: string, message: any) => {
  const padding = " ".repeat(PADDING_BASE - type.length);
  console.log(`[ ${color(PREFIX)} ] [ ${color(type)} ]${padding}${message}`);
};

/**
 * builder logger instance
 */
const logger: IBuilderLogger = {
  success: (message) => print(green, "success", message),
  info: (message) => print(cyan, "info", message),
  error: (err) => {
    let message: string = "unknown";
    if (err instanceof Error) {
      message = (err as Error).message;
    }

    print(red, "error", red(message));
  },
};

export default logger;
