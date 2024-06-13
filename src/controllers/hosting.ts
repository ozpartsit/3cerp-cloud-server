import { Request, Response, NextFunction, RequestHandler } from "express";
import url from "url"
import fs from "fs";
import ejs from "ejs";
import path from "path";
import { I18n } from "i18n";
import Item, { ItemTypes } from "../models/items/model";
import Shop from "../models/ecommerce/shop.model";
import CustomError from "../utilities/errors/customError";

export default class controller {
  public async get(req: Request, res: Response, next: NextFunction) {
    //i18n
    const hostingi18n = new I18n();
    hostingi18n.setLocale(req.locale);


    let hostingPath = path.resolve("hosting");
    let views = path.resolve(hostingPath, req.body.pointer || req.subdomains[0]);
    // check if exists shop - to do (customize template)
    let shop = await Shop.findOne({ subdomain: req.body.pointer || req.subdomains[0] });
    if (shop) views = path.resolve("templates", shop.template);
    else throw new CustomError("doc_not_found", 404);

    // Static files/assets
    let tmp = req.url.toString().split("/")
    let filePath = path.resolve(hostingPath, req.body.pointer || req.subdomains[0], ...tmp);
    // if does not exist on main dir check templates folder
    if (shop && !fs.existsSync(filePath)) filePath = path.resolve("templates", shop.template, ...tmp);
    if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {

      res.sendFile(filePath);
    } else {
      let filepath = path.join(views, "index" + ".ejs");
      let data: any = {};
      data["general"] = {
        title: shop.name,
        logo: 'tba',

        currencies: shop.currencies,
        languages: shop.languages,

        // Meta
        metaTitle: shop.metaTitle,
        metaDescription: shop.metaDescription,
        metaKeywords: shop.metaKeywords,

        //Google Tag
        GSC: shop.GSC,

        //Social Media Tag
        ogTitle: shop.ogTitle,
        ogUrl: shop.ogUrl,
        ogDescription: shop.ogDescription,
        ogImage: shop.ogImage,

        //Social Media Link
        twitterUrl: shop.twitterUrl,
        facebookUrl: shop.instagramUrl,
        instagramUrl: shop.instagramUrl,
        linkedinUrl: shop.linkedinUrl,

      }

      // if view params exists
      if (req.params.view) {
        let viewpath = path.join(views, "pages", req.params.view + ".ejs");
        if (fs.existsSync(viewpath)) {
          data.items = { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 1 };
          if (["search", "products", "items"].includes(req.params.view)) {

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
            let total = await Item.countDocuments(query)
            for (let line of result) {
              line = await line.constantTranslate(req.locale);
            }

            // Pagination url halper
            var q = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
            q.searchParams.delete('page');
            q.searchParams.set('page', '');
            data.url = q.pathname + "?" + q.searchParams.toString();
            // search queries
            data.items.docs = result;
            data.items.totalDocs = total;
            data.items.limit = options.limit;
            data.items.page = options.skip;
            data.items.totalPages = total / options.limit;
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

      hostingi18n.configure({
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
