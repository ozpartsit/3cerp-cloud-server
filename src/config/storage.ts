//requiring path and fs modules
import path from "path";
import fs from "fs";
import Storage, { IStorage } from "../models/storages/schema";
import File, { IFile } from "../models/storages/file/schema";
import Folder, { IFolder } from "../models/storages/folder/schema";
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
    this.mapFolders();
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
    parent: IStorage | IFile | IFolder | null
  ) {
    fs.readdir(dirPath, (err, files) => {
      files.forEach(async (file: string) => {
        let folder = parent ? parent.path : encodeURI("storage");
        const filePath = path.posix.join(folder, encodeURI(file));
        let doc = {
          name: file,
          path: path.posix.join(folder, encodeURI(file)),
          urlcomponent: path.posix.join(folder, encodeURI(file)),
          type: ""
        };

        if (fs.lstatSync(path.join(dirPath, file)).isDirectory()) {
          let storage = await Folder.findOne({ path: filePath }).exec();
          doc.type = "Folder";
          let folder = new Folder(doc);
          if (!storage) folder.save();
          this.mapFiles(path.join(dirPath, file), folder);

        } else {
          let storage = await File.findOne({ path: filePath }).exec();
          if (!storage) {
            doc.type = "File";
            let file = new File(doc);
            file.save();
          }
        }

      });

    });
  }
  private async mapFolders() {
    let folders = await Storage.find({ type: "Folder" }).exec();
    folders.forEach((folder: IStorage) => {
      this.makeDir(folder.path);
    })
  }

}

