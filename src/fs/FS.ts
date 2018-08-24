import { copy } from "fs-extra";
import { stat, readFile, writeFile } from "fs";
import { promisify } from "util";
import { IFS } from "./interfaces";

const ENCODING = "utf8";

const statAsync = promisify(stat);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

/**
 * FS
 */
export class FS implements IFS {

  /**
   * copy path
   */
  public copyPath = copy;

  /**
   * checks if dir exists
   * @param filePath
   */
  public async dirExists(filePath: string): Promise<boolean> {
    let result: boolean;
    try {
      const stat = await statAsync(filePath);
      result = stat.isDirectory();
    } catch (err) {
      result = false;
    }

    return result;
  }

  /**
   * checks if file exists
   * @param filePath
   */
  public async fileExists(filePath: string): Promise<boolean> {
    let result: boolean;
    try {
      const stat = await statAsync(filePath);
      result = stat.isFile();
    } catch (err) {
      result = false;
    }

    return result;
  }

  /**
   * reads file
   * @param filePath
   */
  public readFile(filePath: string): Promise<string> {
    return readFileAsync(filePath, ENCODING);
  }

  /**
   * writes file
   * @param filePath
   * @param content
   */
  public writeFile(filePath: string, content: string): Promise<void> {
    return writeFileAsync(filePath, content, ENCODING);
  }

  /**
   * reads JSON
   * @param filePath
   */
  public async readJSON<T = any>(filePath: string): Promise<T> {
    let result: any;
    try {
      const data = await this.readFile(filePath);
      result = JSON.parse(data);
    } catch (err) {
      result = null;
    }
    return result;
  }

  /**
   * writes JSON
   * @param filePath
   * @param item
   */
  public writeJSON<T = any>(filePath: string, item: T): Promise<void> {
    const content = JSON.stringify(item, null, 2);
    return this.writeFile(filePath, content);
  }
}
