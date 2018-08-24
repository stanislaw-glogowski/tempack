export interface IFS {
  copyPath(srcPath: string, distPath: string): Promise<void>;
  dirExists(filePath: string): Promise<boolean>;
  fileExists(filePath: string): Promise<boolean>;
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: string): Promise<void>;
  readJSON<T = any>(filePath: string): Promise<T>;
  writeJSON<T = any>(filePath: string, data: T): Promise<void>;
}
