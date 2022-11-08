import File, { IFile } from "../models/file.model";
import { Request, Response, NextFunction } from "express";

export default class controller {
  public add(req: Request, res: Response, next: NextFunction) {
    let Model = File;
    let doc = new Model(req.body);

    doc.save((err: any, result: any) => {
      if (err) {
        next(err);
      }
      res.json(result);
    });
  }

  public find(req: Request, res: Response, next: NextFunction) {
    File.find({})
      .limit(50)
      // .skip(parseInt(req.query.skip as string))
      // .select(req.query.select)
      // .sort(req.query.sort)
      .exec((err: any, result: any) => {
        if (err) {
          next(err);
        }
        res.json(result);
      });
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    const path = encodeURI(`/${req.params.path}${req.params["0"]}`);
    let file = await File.findOne({
      urlcomponent: path
    });
    if (file) {
      res
        .status(200)
        .header("Content-Type", file.type)
        .sendFile(file.urlcomponent);
      //.sendFile(file.path, { root: "./storage/" });
    } else {
      res.status(400).send();
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    const path = encodeURI(req.params["0"]);
    let doc = await File.loadDocument(req.params.id);
    doc.rename(path);
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    const path = encodeURI(`/${req.params.path}${req.params["0"]}`);
    File.deleteFile(path).then((err: any) => {
      if (err) {
        next(err);
      }
      res.json({ message: "Successfully deleted contact!" });
    });
  }
}
