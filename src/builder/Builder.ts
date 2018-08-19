import { resolve } from "path";
import {
  IBuilder,
  IBuilderOptions,
  IBuilderConfig,
  IBuilderPackage,
  IBuilderFS,
  IBuilderLogger,
} from "./interfaces";
import {
  CONFIG_FILE_NAME,
  CONFIG_FIELD_NAME,
  DIST_PATH,
  PACKAGE_FILE_NAME,
} from "./constants";

/**
 * Builder
 */
export class Builder implements IBuilder {

  private readonly options: IBuilderOptions;

  private config: IBuilderConfig;

  private srcPackage: IBuilderPackage;

  /**
   * constructor
   * @param options
   * @param fs
   * @param logger
   */
  constructor(options: IBuilderOptions, private fs: IBuilderFS, private logger: IBuilderLogger) {
    const { srcPath, distPath, configPath, packagePath } = options;

    this.options = {
      srcPath,
      distPath: resolve(srcPath, distPath || DIST_PATH),
      configPath: resolve(srcPath, configPath || CONFIG_FILE_NAME),
      packagePath: resolve(srcPath, packagePath || PACKAGE_FILE_NAME),
    };
  }

  /**
   * builds
   */
  public build(): void {
    (async () => {
      await this.setup();
      await this.buildAndSavePackage();
      await this.copyFiles();
    })()
      .then(() => this.logger.success("package built"))
      .catch(this.logger.error);
  }

  private async setup(): Promise<void> {
    const { configPath, packagePath } = this.options;

    if (!await this.fs.fileExists(packagePath)) {
      throw new Error(`package.json not found at ${packagePath}`);
    }

    this.srcPackage = await this.fs.readJSON<IBuilderPackage>(packagePath);

    if (
      !this.srcPackage ||
      typeof this.srcPackage !== "object"
    ) {
      throw new Error(`Invalid package.json at ${packagePath}`);
    }

    if (!this.srcPackage[ CONFIG_FIELD_NAME ]) {
      if (!await this.fs.fileExists(configPath)) {
        throw new Error(`Config not found at ${configPath}`);
      }

      this.config = await this.fs.readJSON<IBuilderConfig>(configPath);
    } else {
      this.config = this.srcPackage[ CONFIG_FIELD_NAME ];
      delete this.srcPackage[ CONFIG_FIELD_NAME ];
    }

    if (
      !this.config ||
      typeof this.srcPackage !== "object"
    ) {
      throw new Error("Invalid config");
    }

    this.config = {
      mergePackageWith: {},
      omitPackageKeys: [],
      copyFiles: [],
      ...this.config,
    };

    if (
      !this.config.mergePackageWith ||
      typeof this.srcPackage.mergePackageWith !== "object"
    ) {
      throw new Error("Invalid config.mergePackageWith value");
    }

    if (!Array.isArray(this.srcPackage.omitPackageKeys)) {
      throw new Error("Invalid config.omitPackageKeys value");
    }
    if (!Array.isArray(this.srcPackage.copyFiles)) {
      throw new Error("Invalid config.copyFiles value");
    }
  }

  private async buildAndSavePackage(): Promise<void> {
    const { distPath } = this.options;
    const { mergePackageWith, omitPackageKeys } = this.config;

    const distFilePath = resolve(distPath, PACKAGE_FILE_NAME);

    let distPackage: IBuilderPackage = {
      ...this.srcPackage,
    };

    for (const key of omitPackageKeys) {
      delete distPackage[ key ];
    }

    distPackage = {
      ...distPackage,
      ...mergePackageWith,
    };

    await this.fs.writeJSON(distFilePath, distPackage);

    this.logger.info(`Package.json saved at ${distFilePath}`);
  }

  private async copyFiles(): Promise<void> {
    const { srcPath, distPath } = this.options;
    const { copyFiles: fileNames } = this.config;

    for (const fileName of fileNames) {

      if (
        fileName &&
        typeof fileName === "string"
      ) {
        const srcFilePath = resolve(srcPath, fileName);
        const distFilePath = resolve(distPath, fileName);

        if (!await this.fs.fileExists(srcFilePath)) {
          throw new Error(`File ${fileName} doesn't exists`);
        }

        if (await this.fs.fileExists(distFilePath)) {
          throw new Error(`File ${fileName} already copied`);
        }

        await this.fs.copyFile(srcFilePath, distFilePath);

        this.logger.info(`${fileName} saved at ${distFilePath}`);
      }
    }
  }
}
