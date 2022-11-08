import { Request, Response, NextFunction, RequestHandler } from "express";
import ejs from "ejs";
import path from "path";
import i18n from "../config/i18n";
export default class controller {
  public async get(req: Request, res: Response, next: NextFunction) {
    var views = path.resolve(__dirname, "../../pages", req.params.page);
    var filepath = path.join(views, "index" + ".ejs");
    console.log(req.subdomains);
    // i18n
    i18n.configure({
      directory: path.join(views, "/locales")
    });

    try {
      let result1 = { company: "testss" };
      ejs.renderFile(
        filepath,
        { data: result1, view: req.params.view },
        (err, result) => {
          console.log(err);
          res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
          res.end(result);
        }
      );
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}
