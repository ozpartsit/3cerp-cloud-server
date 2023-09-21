import Storage, { StorageTypes } from "../models/storages/model";
import File, { IFile } from "../models/storages/file/schema";
import Folder, { IFolder } from "../models/storages/folder/schema";
import controller from "./genericController";
import { Document, Model } from 'mongoose';
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import CustomError from "../utilities/errors/customError";
import Account from "../models/account.model";
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

        let uploadedFiles: IFile[] = [];
        let folderModel = Folder.setAccount(req.headers.account);
        let folder = await folderModel.findOne().exec();

        if (req.body && req.body.folder) {
          folder = await folderModel.findById(req.body.folder).exec()
          if (!folder) {
            throw new CustomError("folder_not_found", 404);
          }
        }

        // jeżeli folder główny nie istnieje, tworzy go i zwraca
        if (!folder) {
          const account = await Account.findById(req.headers.account)
          if (account) folder = await account.initStorage()
          else throw new CustomError("account_not_found", 404);
        }

        for (let file of files) {
          // scieżka do docelowej lokalizacji plików
          const filePath = path.posix.join(folder.path, encodeURI(file.name));
          file.mv(path.posix.join(this.storagePath, filePath));
          
          let FileModel = await File.setAccount(req.headers.account);
          let doc = new FileModel({
            name: file.name,
            type: "File",
            folderPath: folder.path,
            folder: folder,
            path: filePath,
            urlcomponent: filePath,
          });

          let newFile = await doc.save();
          uploadedFiles.push(newFile)
        }
        res.send({ status: "seccess", data: { uploadedFiles } });
      }
    } catch (error) {
      return next(error);
    }
  }
}
