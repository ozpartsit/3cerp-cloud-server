import Storage, { StorageTypes } from "../models/storages/model";
import File, { IFile } from "../models/storages/file/schema";
import controller from "./controller";
import path from "path";
import { Request, Response, NextFunction, RequestHandler } from "express";
export default class FileController extends controller {
  public storagePath: string = path.resolve("storage");
  constructor() {
    super({ model: Storage, submodels: StorageTypes });
  }
  public async upload(req: Request, res: Response, next: NextFunction) {
    // todo
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {
     
        let files: any[] = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

        let uploaded: IFile[] = [];
        for (let file of files) {
          let dirPath = "uploads";
          file.mv(path.join(this.storagePath, dirPath, file.name));

          let doc = new File({
            name: file.name,
            type: "File",
            path: path.join("storage", encodeURI(dirPath), encodeURI(file.name)),
            urlcomponent: path.join("storage", encodeURI(dirPath), encodeURI(file.name)),
          });

          //Storage.updateOrInsert(doc)
          let newFile = await doc.save();
          uploaded.push(newFile)
          //send response

        }
        res.send(uploaded);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
