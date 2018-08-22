export interface IBuilder {
  readSrcPackage(): Promise<IBuilderPackage>;
  readConfig(): Promise<IBuilderConfig>;
  build(): Promise<void>;
}

export interface IBuilderOptions {
  srcPath: string;
  distPath: string;
  configPath: string;
  packagePath: string;
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
  tempack: IBuilderConfig;
}
