import { Request, Response, NextFunction, RequestHandler } from "express";
import url from "url"
import fs from "fs";
import ejs from "ejs";
import path from "path";
import i18n from "../config/i18n";
import Item, { ItemTypes } from "../models/items/model";
import Shop from "../models/shop.model";
export default class controller {
  public async get(req: Request, res: Response, next: NextFunction) {
    i18n.setLocale(req.locale)

    let hostingPath = path.resolve("hosting");
    let views = path.resolve(hostingPath, req.body.pointer || req.subdomains[0]);
    // check if exists shop - to do (customize template)
    let shop = await Shop.findOne({ subdomain: req.body.pointer || req.subdomains[0] });
    if (shop) views = path.resolve("templates", shop.template);


    // Static files/assets
    let tmp = req.url.toString().split("/")
    let filePath = path.resolve(hostingPath, req.body.pointer || req.subdomains[0], ...tmp);
    // if does not exist on main dir check templates folder
    if (shop && !fs.existsSync(filePath)) filePath = path.resolve("templates", shop.template, ...tmp);
    if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {

      res.sendFile(filePath);
    } else {
      let filepath = path.join(views, "index" + ".ejs");
      let data: any;

      // if view params exists
      if (req.params.view) {
        let viewpath = path.join(views, "pages", req.params.view + ".ejs");
        if (fs.existsSync(viewpath)) {
          data = { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 1 };
          if (["search", "products"].includes(req.params.view)) {

            let query = {};
            if (req.query.keyword) {
              query['name'] = { $regex: `.*${req.query.keyword}.*` };
            };
            let filters = (req.query.filters || "").toString();
            if (filters) {
              query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
            }

            let options = { sort: {}, limit: 0, skip: 0 };
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
            options.skip = parseInt((req.query.page || 0 * options.limit).toString());
            let result = await Item.findDocuments(query, options);
            let total = await Item.count(query)
            for (let line of result) {
              line = await line.autoPopulate(req);
            }

            // Pagination url halper
            var q = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
            q.searchParams.delete('page');
            q.searchParams.set('page', '');
            data.url = q.pathname + "?" + q.searchParams.toString();
            // search queries
            data.docs = result;
            data.totalDocs = total;
            data.limit = options.limit;
            data.page = options.skip;
            data.totalPages = total / options.limit;
          }
          if (["item", "product"].includes(req.params.view)) {
            let result = await Item.getDocument('60df047fec2924769a00834d', 'view');
            data.item = result;

          }
        } else {
          // set 404 page
          req.params.view = "404";
        }
      }

      // i18n
      i18n.configure({
        directory: path.join(views, "/locales")
      });

      try {
        ejs.renderFile(
          filepath,
          { data: data, view: req.params.view },
          (err, result) => {

            console.log(err, !!result);
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




}
