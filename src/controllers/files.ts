import Storage, { StorageTypes } from "../models/storages/model";
import File, { IFile } from "../models/storages/file/schema";
import Folder, { IFolder } from "../models/storages/folder/schema";
import controller from "./genericController";
import { Document, Model } from 'mongoose';
import path from "path";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import CustomError from "../utilities/errors/customError";
// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }
export default class FileController<T extends IExtendedDocument> extends controller<T> {
  public storagePath: string = path.resolve("storage");
  constructor(model: IModel<T>) {
    super(model);
  }
  public async upload(req: Request, res: Response, next: NextFunction) {
    // todo
    try {
      if (!req.files) {
        throw new CustomError("no_file", 404);
      } else {

        let files: any[] = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

        let uploaded: IFile[] = [];
        let dirPath = "storage/uploads";
        if (req.body && req.body.folder) {
          let folder = await Folder.findById(req.body.folder).exec()
          if (folder) {
            dirPath = folder.path;
          } else {
            throw new CustomError("folder_not_found", 404);
          }
        }
        for (let file of files) {
          file.mv(path.join(this.storagePath, dirPath, file.name));

          let doc = new File({
            name: file.name,
            type: "File",
            path: path.posix.join(encodeURI(dirPath), encodeURI(file.name)),
            urlcomponent: path.posix.join(encodeURI(dirPath), encodeURI(file.name)),
          });

          let newFile = await doc.save();
          uploaded.push(newFile)
        }
        res.send(uploaded);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
