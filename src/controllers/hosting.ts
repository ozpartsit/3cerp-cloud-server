import { Request, Response, NextFunction, RequestHandler } from "express";
import fs from "fs";
import ejs from "ejs";
import path from "path";
import i18n from "../config/i18n";
import Item, { ItemTypes } from "../models/items/model";
export default class controller {
  public async get(req: Request, res: Response, next: NextFunction) {
    i18n.setLocale(req.locale)
    console.log('tu tez', req.subdomains, req.params.view)
    let hostingPath = path.resolve("hosting");
    var views = path.resolve(hostingPath, req.subdomains[0],);
    var filepath = path.join(views, "index" + ".ejs");

    let data = { company: "testss", searchResult: [], item: {} };

    if (req.params.view) {
      let viewpath = path.join(views, "templates", req.params.view + ".ejs");
      if (fs.existsSync(viewpath)) {
        if (["search", "products"].includes(req.params.view)) {


          let query = {};
          if (req.query.keyword) {
            query['name'] = { $regex: `.*${req.query.keyword}.*` };
          };
          let filters = (req.query.filters || "").toString();
          if (filters) {
            query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
          }

          let options = { sort: {}, limit: 0 };
          let sort = (req.query.sort || "").toString();
          if (sort) {
            options.sort = sort.split(",").reduce((o, f) => {
              // -date = desc sort per date field
              if (f[0] == "-") {
                f = f.substring(1);
                o[f] = -1;
              } else
                o[f] = 1;
              return o;
            }, {});
          }
          options.limit = parseInt((req.query.limit || 9).toString());
          //console.log(options)
          let result = await Item.findDocuments(query, options);
          for (let line of result) {
            await line.autoPopulate(req);
          }
          data.searchResult = result;
        }
        if (["item", "product"].includes(req.params.view)) {
          let result = await Item.getDocument('60df047fec2924769a00834d', 'view');
          data.item = result;
        }
      } else {
        req.params.view = "404";
      }
    }

    // i18n
    i18n.configure({
      directory: path.join(views, "/locales")
    });

    try {
      console.log(filepath, req.params.view)
      ejs.renderFile(
        filepath,
        { data: data, view: req.params.view },
        (err, result) => {

          console.log(err, !!result);
          //res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
          res.setHeader('content-type', 'text/html');
          res.writeHead(200, 'Ok');
          res.write(result);
          res.end();
        }
      );
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
}
