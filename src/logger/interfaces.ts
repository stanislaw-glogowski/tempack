export interface ILogger {
  success(message: string): void;
  info(message: string): void;
  error(err: any): void;
}

export interface ILoggerOptions {
  silent?: boolean;
  disableColors?: boolean;
}
