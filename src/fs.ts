import { copy as copyFile } from "fs-extra";
import { stat, readFile, writeFile } from "fs";
import { promisify } from "util";
import { IBuilderFS } from "./builder";

const ENCODING = "utf8";

const statAsync = promisify(stat);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

/**
 * builder file system instance
 */
const fs: IBuilderFS = {
  copyFile,
  fileExists: async (filePath) => {
    let result: boolean;
    try {
      const stat = await statAsync(filePath);
      result = stat.isFile();
    } catch (err) {
      result = false;
    }

    return result;
  },
  readJSON: async (filePath) => {
    let result: any;
    try {
      const data = await readFileAsync(filePath, ENCODING);
      result = JSON.parse(data);
    } catch (err) {
      result = null;
    }
    return result;
  },
  writeJSON: async (filePath, item) => {
    const data = JSON.stringify(item);
    await writeFileAsync(filePath, data, ENCODING);
  },
};

export default fs;
