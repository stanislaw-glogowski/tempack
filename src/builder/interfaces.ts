import { CONFIG_FIELD_NAME } from "./constants";

export interface IBuilder {
  build(): void;
}

export interface IBuilderOptions {
  srcPath: string;
  distPath: string;
  configPath?: string;
  packagePath?: string;
}

export interface IBuilderConfig {
  mergePackageWith: {
    [ key: string ]: any;
  };
  omitPackageKeys: string[];
  copyFiles: string[];
}

export interface IBuilderPackage {
  [ key: string ]: any;
  [ CONFIG_FIELD_NAME ]?: IBuilderConfig;
}

export interface IBuilderFS {
  copyFile(srcPath: string, distPath: string): Promise<void>;
  fileExists(filePath): Promise<boolean>;
  readJSON<T = any>(filePath): Promise<T>;
  writeJSON<T = any>(filePath, data: T): Promise<void>;
}

export interface IBuilderLogger {
  success(message: string): void;
  info(message: string): void;
  error(err: any): void;
}
