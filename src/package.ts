import { TEMPACK_FIELD } from "./defaults";
import { merge, omit } from "./utils";
import { IConfigData, IConfigDataPackageBuildOptions } from "./config";

export interface IPackageData {
  [key: string]: any;
  tempack?: IConfigData;
}

export interface IPackage {
  config: IConfigData;
  merge(data: IPackageData): void;
  build(options: IConfigDataPackageBuildOptions): IPackageData;
}

export class Package implements IPackage {
  private data: IPackageData = {};

  get config() {
    return this.data[TEMPACK_FIELD] || {};
  }

  public merge(data) {
    merge(this.data, data);
  }

  public build(options) {
    merge(options, {
      omit: [TEMPACK_FIELD],
    });
    omit(this.data, options.omit);
    merge(this.data, options.mergeWith);
    return this.data;
  }
}
