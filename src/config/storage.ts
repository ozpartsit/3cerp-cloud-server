//requiring path and fs modules
import path from "path";
import fs from "fs";
import Storage, { IStorage } from "../models/storages/schema";
import File, { IFile } from "../models/storages/file/schema";
import Folder, { IFolder } from "../models/storages/folder/schema";
import { Types } from 'mongoose';
export default class StorageStructure {
  //resolve storage path of directory
  public storagePath: string = path.posix.resolve("storage");

  constructor() {
    if (!fs.existsSync(this.storagePath)) fs.mkdirSync(this.storagePath);
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


        if (fs.lstatSync(path.posix.join(dirPath, file)).isDirectory()) {
          console.log("Folder")
        } else {
          let storage = await File.findOne({ path: filePath }).exec();
          if (!storage) {

            let doc = {
              name: file,
              path: filePath,
              urlcomponent: filePath,
              type: "File",
              folderPath: folder,
              folder: parent
            };

            let newFile = new File(doc);
            newFile.save();
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

