import { resolve } from "path";
import { PACKAGE_FILE_NAME } from "../shared";
import { IFS } from "../fs";
import { ILogger } from "../logger";
import { IBuilder, IBuilderOptions, IBuilderConfig, IBuilderPackage } from "./interfaces";

/**
 * Builder
 */
export class Builder implements IBuilder {

  private config: IBuilderConfig;

  private srcPackage: IBuilderPackage;

  /**
   * constructor
   * @param options
   * @param fs
   * @param logger
   */
  constructor(private options: IBuilderOptions, private fs: IFS, private logger: ILogger) {
    //
  }

  /**
   * reads src package
   */
  public async readSrcPackage(): Promise<IBuilderPackage> {
    const { packagePath } = this.options;

    if (!await this.fs.fileExists(packagePath)) {
      throw new Error(`package.json not found at ${packagePath}`);
    }

    const result = await this.fs.readJSON<IBuilderPackage>(packagePath);

    if (!result || typeof result !== "object") {
      throw new Error(`invalid package.json at ${packagePath}`);
    }

    return result;
  }

  /**
   * reads config
   */
  public async readConfig(): Promise<IBuilderConfig> {
    const { configPath } = this.options;

    let result: IBuilderConfig;

    if (!this.srcPackage.tempack) {
      if (!await this.fs.fileExists(configPath)) {
        throw new Error(`config not found at ${configPath}`);
      }

      result = await this.fs.readJSON<IBuilderConfig>(configPath);

    } else {

      result = this.srcPackage.tempack;
      delete this.srcPackage.tempack;
    }

    result = {
      mergePackageWith: {},
      omitPackageKeys: [],
      copyFiles: [],
      copyDirs: [],
      ...result,
    };

    if (!result || typeof this.srcPackage !== "object") {
      throw new Error("Invalid config");
    }

    if (!result.mergePackageWith || typeof result.mergePackageWith !== "object") {
      throw new Error("invalid config.mergePackageWith value");
    }

    if (!Array.isArray(result.omitPackageKeys)) {
      throw new Error("invalid config.omitPackageKeys value");
    }

    if (!Array.isArray(result.copyDirs)) {
      throw new Error("invalid config.copyDirs value");
    }

    return result;
  }

  /**
   * builds
   */
  public async build(): Promise<void> {
    this.srcPackage = await this.readSrcPackage();
    this.config = await this.readConfig();

    await this.buildAndSavePackage();
    await this.copyFiles();
    await this.copyDirs();
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

    this.logger.info(`package.json saved at ${distFilePath}`);
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
          throw new Error(`file ${fileName} doesn't exists`);
        }

        if (await this.fs.fileExists(distFilePath)) {
          throw new Error(`file ${fileName} already copied`);
        }

        await this.fs.copyPath(srcFilePath, distFilePath);

        this.logger.info(`${fileName} saved at ${distFilePath}`);
      }
    }
  }

  private async copyDirs(): Promise<void> {
    const { srcPath, distPath } = this.options;
    const { copyDirs: dirNames } = this.config;

    for (const dirName of dirNames) {

      if (
        dirName &&
        typeof dirName === "string"
      ) {
        const srcDirPath = resolve(srcPath, dirName);
        const distDirPath = resolve(distPath, dirName);

        if (!await this.fs.dirExists(srcDirPath)) {
          throw new Error(`dir ${srcDirPath} doesn't exists`);
        }

        if (await this.fs.dirExists(distDirPath)) {
          throw new Error(`dir ${distDirPath} already copied`);
        }

        await this.fs.copyPath(srcDirPath, distDirPath);

        this.logger.info(`${dirName} saved at ${distDirPath}`);
      }
    }
  }
}
