import { Builder, IBuilder, IBuilderOptions } from "./builder";

describe("Builder", () => {

  const options: IBuilderOptions = {
    srcPath: "/src",
    distPath: "/dist",
    configPath: "/config",
    packagePath: "/package",
  };

  const fs = {
    copyPath: jest.fn(),
    dirExists: jest.fn(),
    fileExists: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    readJSON: jest.fn(),
    writeJSON: jest.fn(),
  };

  const logger = {
    success: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  };

  afterEach(() => {
    Object.values(fs).forEach((mock) => mock.mockReset());
    Object.values(logger).forEach((mock) => mock.mockReset());
  });

  describe("constructor", () => {

    test("creating Builder instance", () => {
      const builder = new Builder(options, fs, logger);
      expect(builder).toBeInstanceOf(Builder);
    });
  });

  describe("build()", () => {

    let builder: IBuilder;

    beforeAll(() => {
      builder = new Builder(options, fs, logger);
    });

    it("should build package", async () => {

      fs.copyPath.mockImplementation(() => Promise.resolve());
      fs.dirExists.mockImplementation((fileName) => {
        let result = true;
        switch (fileName) {
          case "/dist/dir1":
          case "/dist/dir2":
            result = false;
            break;
        }

        return Promise.resolve(result);
      });

      fs.fileExists.mockImplementation((fileName) => {
        let result = true;
        switch (fileName) {
          case "/dist/file1":
          case "/dist/file2":
          case "/dist/file3":
            result = false;
            break;
        }

        return Promise.resolve(result);
      });
      fs.readJSON.mockImplementation(async (filePath: string) => {
        let result: any = null;
        switch (filePath) {
          case "/package":
            result = {
              version: "1.0.0",
              private: true,
              description: "description",
            };
            break;

          case "/config":
            result = {
              mergePackageWith: {
                version: "0.0.1",
                author: "author",
              },
              omitPackageKeys: [ "private" ],
              copyFiles: ["file1", "file2", "file3"],
              copyDirs: ["dir1", "dir2"],
            };
            break;
        }
        return result;
      });

      await builder.build();

      expect(fs.writeJSON).toHaveBeenCalled();
      expect(fs.writeJSON.mock.calls[ 0 ][ 0 ]).toBe("/dist/package.json");
      expect(fs.writeJSON.mock.calls[ 0 ][ 1 ]).toEqual({
        version: "0.0.1",
        author: "author",
        description: "description",
      });
      expect(fs.copyPath).toHaveBeenCalledTimes(5);
    });
  });
});
