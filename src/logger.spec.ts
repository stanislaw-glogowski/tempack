import { green } from "colors";
import { Logger } from "./logger";

describe("Logger", () => {

  const printer = jest.fn();

  afterEach(() => {
    printer.mockClear();
  });

  describe("constructor", () => {

    test("creating Logger instance", () => {
      const logger = new Logger({
        disableColors: false,
        silent: false,
      });

      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe("silent mode", () => {

    test("turned off", () => {
      const logger = new Logger({
        silent: false,
      }, printer);

      logger.success("silent");

      expect(printer).toBeCalled();
    });

    test("turned on", () => {
      const logger = new Logger({
        silent: true,
      }, printer);

      logger.success("silent");

      expect(printer).not.toBeCalled();
    });
  });

  describe("disable colors", () => {

    test("turned off", () => {
      const logger = new Logger({
        disableColors: false,
      }, printer);

      logger.success("message");

      expect(printer).toBeCalledWith(`[ ${green("tempack")} ] [ ${green("success")} ] message`);
    });

    test("turned on", () => {
      const logger = new Logger({
        disableColors: true,
      }, printer);

      logger.success("message");

      expect(printer).toBeCalledWith("[ tempack ] [ success ] message");
    });
  });
});
