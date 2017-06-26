import { merge } from "./utils";

export interface IConfigDataPackageBuildOptions {
  mergeWith?: { [key: string]: any };
  omit?: string[];
}

export interface IConfigData {
  package?: IConfigDataPackageBuildOptions;
  files?: string[];
}

export interface IConfig extends IConfigData {
  merge(data: IConfigData): void;
}

export class Config implements IConfig {
  private data: IConfigData = {};

  get package() {
    return this.data.package || {};
  }

  get files() {
    return this.data.files || [];
  }

  public merge(data) {
    merge(this.data, data);
  }
}
