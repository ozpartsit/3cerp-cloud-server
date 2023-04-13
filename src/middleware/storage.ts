//requiring path and fs modules
import path from "path";
import fs from "fs";
import mime from "mime-types";
import File, { IFile } from "../models/file.model";
import { getFileSize } from "../utilities/usefull";

export default class StorageStructure {
  //resolve storage path of directory
  public storagePath: string = path.resolve("storage");
  public importPath: string = path.resolve("storage", "import");
  public exportPath: string = path.resolve("storage", "export");
  public uploadsPath: string = path.resolve("storage", "uploads");
  constructor() {
    if (!fs.existsSync(this.storagePath)) fs.mkdirSync(this.storagePath);
    if (!fs.existsSync(this.importPath)) fs.mkdirSync(this.importPath);
    if (!fs.existsSync(this.exportPath)) fs.mkdirSync(this.exportPath);
    if (!fs.existsSync(this.uploadsPath)) fs.mkdirSync(this.uploadsPath);
  }
  public init() {
    console.log("Init Storage", this.storagePath);
    this.mapFiles(this.storagePath, null);
  }
  public makeDir(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }
  public delDir(path: string) {
    try {
      fs.rmdirSync(path, { recursive: true });
      console.log(`${path} is deleted!`);
    } catch (err) {
      console.error(`Error while deleting ${path}.`);
    }
  }
  private mapFiles(
    dirPath: string,
    //parentPath: string = "root",
    parent: IFile | null
  ) {
    fs.readdir(dirPath, (err, files) => {
      let dirSize = 0;
      files.forEach((file: string) => {
        let doc: IFile = {
          name: file,
          type: mime.lookup(file).toString(),
          path: dirPath,
          urlcomponent: encodeURI(`${dirPath}/${file}`)
        };

        if (fs.lstatSync(path.join(dirPath, file)).isDirectory()) {
          doc.type = "directory";
          this.mapFiles(path.join(dirPath, file), doc);
        } else {
         
          doc.size = getFileSize(path.join(dirPath, file));
          dirSize += doc.size;
        }

        File.updateOrInsert(doc);
      });
      if (parent) {
        parent.size = dirSize;
        File.updateOrInsert(parent);
      }
    });
  }
}
