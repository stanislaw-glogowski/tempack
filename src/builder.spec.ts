import { IBuilderLogger, IBuilderFS, IBuilder, Builder } from "./builder";

describe("Builder", () => {
  describe("build()", () => {

    const logger: IBuilderLogger = {
      success: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    };

    const fsWriteJSON = jest.fn(async (filePath: string, data: any) => {
      //
    });

    const fs: IBuilderFS = {
      copyFile: jest.fn(async (srcPath: string, distPath: string) => {
        //
      }),
      fileExists: jest.fn(async (filePath: string) => {
        return true;
      }),
      readJSON: jest.fn(async (filePath: string) => {
        let result: any = null;
        switch (filePath) {
          case "/package.json":
            result = {
              version: "1.0.0",
              private: true,
            };
            break;

          case "/tempack.json":
            result = {
              mergePackageWith: {
                version: "0.0.1",
              },
              omitPackageKeys: [ "private" ],
            };
            break;
        }
        return result;
      }),
      writeJSON: fsWriteJSON,
    };

    let builder: IBuilder;

    it("should creates builder", () => {
      builder = new Builder({
        configPath: "",
        distPath: null,
        packagePath: null,
        srcPath: "/",
      }, fs, logger);

      expect(builder).toBeInstanceOf(Builder);
    });

    it("should build package.json", async () => {
      await builder.build();

      expect(fsWriteJSON).toHaveBeenCalled();
      expect(fsWriteJSON.mock.calls[ 0 ][ 0 ]).toBe("/dist/package.json");
      expect(fsWriteJSON.mock.calls[ 0 ][ 1 ]).toEqual({
        version: "0.0.1",
      });
    });
  });
});
