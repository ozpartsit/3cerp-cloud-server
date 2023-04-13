import File, { IFile } from "../models/file.model";
import controller from "./controller";
import mime from "mime-types";
import { getFileSize } from "../utilities/usefull";
import { Request, Response, NextFunction, RequestHandler } from "express";
export default class FileController extends controller {
  constructor() {
    super({ model: File, submodels: {} });
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
        let files = Array.isArray(req.files) ? req.files : [req.files];

        for (let file of files) {
          file = file.files;
          let dirPath = "/storage/uploads";
          file.mv(`.${dirPath}/${file.name}`);

          let doc: IFile = {
            name: file.name,
            type: mime.lookup(file.name).toString(),
            path: dirPath,
            urlcomponent: encodeURI(`${dirPath}/${file.name}`)
          };
          File.updateOrInsert(doc);
          //send response
          res.send({
            status: true,
            message: 'File is uploaded',
          });
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
