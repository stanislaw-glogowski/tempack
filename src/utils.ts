import { ncp } from "ncp";
import { readFile, writeFile } from "fs";
import { mergeWith, isArray, unset } from "lodash";

export function readJsonFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    readFile(filePath, "utf8", (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(content));
      }
    });
  });
}

export function writeJsonFile(filePath: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function mergeCustomizer(objValue: any, srcValue: any) {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

export function merge(dst: {}, source: any): void {
  mergeWith(dst, source || {}, mergeCustomizer);
}

export function omit(data: {}, paths: string[]): void {
  paths.forEach((path) => unset(data, path));
}
