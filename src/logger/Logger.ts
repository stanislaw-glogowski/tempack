import { green, cyan, red } from "colors/safe";
import { ILogger, ILoggerOptions } from "./interfaces";

const LOGGER_PREFIX = "tempack";
const LOGGER_PADDING_BASE = 8;

enum Types {
  Success = "success",
  Info = "info",
  Error = "error",
}

/**
 * Logger
 */
export class Logger implements ILogger {

  /**
   * constructor
   * @param options
   * @param printer
   */
  constructor(
    private options: ILoggerOptions,
    /* tslint:disable-next-line:no-console */
    private printer: (...args: any[]) => void = console.log,
  ) {
    this.success = this.success.bind(this);
    this.info = this.info.bind(this);
    this.error = this.error.bind(this);
  }

  /**
   * prints success
   * @param message
   */
  public success(message: string): void {
    this.print(Types.Success, message);
  }

  /**
   * prints info
   * @param message
   */
  public info(message: string): void {
    this.print(Types.Info, message);
  }

  /**
   * prints error
   * @param err
   */
  public error(err: any): void {
    let message: string = "unknown";

    if (err instanceof Error) {
      message = (err as Error).message;
    }

    this.print(Types.Error, message);
  }

  private print(type: Types, message: string): void {
    const { silent, disableColors } = this.options;
    if (!silent) {
      let color: (value: string) => string = (value) => value;

      if (!disableColors) {
        switch (type) {
          case Types.Success:
            color = green;
            break;
          case Types.Info:
            color = cyan;
            break;
          case Types.Error:
            color = red;
            break;
        }
      }

      const padding = " ".repeat(LOGGER_PADDING_BASE - type.length);

      this.printer(`[ ${color(LOGGER_PREFIX)} ] [ ${color(type)} ]${padding}${message}`);
    }
  }
}
