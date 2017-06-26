import { resolve } from "path";
import { defaults } from "lodash";
import { copy } from "fs-extra";
import { PACKAGE_FILE, TEMPACK_FILE } from "./defaults";
import { readJsonFile, writeJsonFile } from "./utils";
import { IOptions } from "./options";
import { Config } from "./config";
import { Package } from "./package";

type Task = () => Promise<any>;

export class Runner {
  private package = new Package();
  private config = new Config();
  private tasks: Task[] = [];

  constructor(private options: IOptions) {
    defaults(this.options, {
      packageFile: PACKAGE_FILE,
      configFile: TEMPACK_FILE,
    });
  }

  public setup(): this {
    const addTask = (task: Task) => {
      this.tasks = [task, ...this.tasks];
    };

    addTask(() => this.readConfigFile());
    addTask(() => this.readPackageFile());
    addTask(() => this.writePackageFile());
    addTask(() => this.copyFiles());

    return this;
  }

  public run(): Promise<any> {
    return new Promise((resolve, reject) => {
      const next = () => {
        const task = this.tasks.pop();
        if (task) {
          task().then(
            () => next(),
            (err: Error) => reject(err.message),
          );
        } else {
          resolve();
        }
      };

      next();
    });
  }

  private async readConfigFile() {
    try {
      this.config.merge(await readJsonFile(
        resolve(this.options.workingPath, this.options.configFile),
      ));
    } catch (err) {
      if (this.options.configFile !== TEMPACK_FILE) {
        throw err;
      }
    }
  }

  private async readPackageFile() {
    this.package.merge(await readJsonFile(
      resolve(this.options.workingPath, this.options.packageFile),
    ));

    // package section
    this.config.merge(this.package.config);
  }

  private writePackageFile() {
    return writeJsonFile(
      resolve(this.options.workingPath, this.options.distPath, PACKAGE_FILE),
      this.package.build(this.config.package),
    );
  }

  private copyFiles() {
    const promises = this.config.files.map((path) => copy(
      resolve(this.options.workingPath, path),
      resolve(this.options.workingPath, this.options.distPath, path),
    ));

    return Promise.all(promises);
  }
}
