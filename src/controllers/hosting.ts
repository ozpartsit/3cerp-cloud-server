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
  public async setLanguage(req: Request, res: Response, next: NextFunction) {
    const language = req.params.language;
    console.log('asdasd')
    res.cookie('language', language, { maxAge: 900000, httpOnly: true });
    res.redirect('back');
  }
  public async get(req: Request, res: Response, next: NextFunction) {
    //i18n
    const hostingi18n = new I18n();
    console.log(req.cookies)

    let hostingPath = path.resolve("hosting");
    let views = path.resolve(hostingPath, req.body.pointer || req.subdomains[0]);
    // check if exists shop - to do (customize template)
    let shop = await Shop.getDocument(req.body.pointer || req.subdomains[0], "simple", true, "subdomain")
    if (shop) {
      await shop.autoPopulate()
      views = path.resolve("templates", shop.template);
    }
    else throw new CustomError("doc_not_found", 404);

    // Static files/assets
    let tmp = req.url.toString().split("/")
    let filePath = path.resolve(hostingPath, req.body.pointer || req.subdomains[0], ...tmp);
    // if does not exist on main dir check templates folder
    if (shop && !fs.existsSync(filePath)) filePath = path.resolve("templates", shop.template, ...tmp);
    if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {

      res.sendFile(filePath);
    } else {
      let urlComponent = ""
      if (req.params && req.params.view) urlComponent = `${req.params.param || req.params.view}`;

      let filepath = path.join(views, "index" + ".ejs");
      let data: any = { info: {}, page: {}, template: {}, content: {} };

      data["info"] = {
        //address
        address: shop.address,
      }

      data["views"] = {
        findItems: ["search", "products", "items"],
        getItem: ["item", "product", "detail"],
        cart: ["TBA"],
        checkout: ["TBA"],
      }

      data["page"] = {
        host: `${req.protocol}://${req.get('host')}`,
        language: shop.languages.includes(req.cookies.language || req.locale) ? req.cookies.language || req.locale : shop.languages[0],
        defaultLanguage: shop.languages[0],
        title: shop.name,
        logo: shop.logo,
        urlComponent: urlComponent,
        path: req.path,

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
      data["template"] = {
        //colors
        colorAccent: shop.colorAccent,
        colorPrimary: shop.colorPrimary,
        colorSecondary: shop.colorSecondary,
      }
      data["nav"] = {
        //pages
        pages: shop.pages.filter(p => (p.languages || []).includes(data.page.language)).map(p => {
          return {
            urlComponent: p.urlComponent,
            path: `${data.page.host}/${p.urlComponent}`,
            name: p.name,
          }
        })

      }
      try {
        // if view params exists
        if (req.params.view) {

          if (req.params.view == "favicon.ico") {
            console.log("favicon.ico not found")
          } else {
            let viewpath = path.join(views, "views", req.params.view + ".ejs");

            if (fs.existsSync(viewpath)) {
              data.content = { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 1 };
              if (["search", "products", "items"].includes(req.params.view)) {

                let query = {};
                if (req.query.keyword) {
                  query['name'] = { $regex: `.*${req.query.keyword}.*`, $options: 'i' };
                };
                let filters = (req.query.filters || "").toString();
                if (filters) {
                  query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
                }

                let options = { sort: {}, limit: 0, skip: 0, select: { name: 1, urlComponent: 1, images: 1, "images.fullPath": 1, "images.path": 1, "images.urlComponent": 1 } };
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
                let page = Number(req.query.page || 1);
                options.limit = parseInt((req.query.limit || 9).toString());
                options.skip = ((page || 1) - 1) * options.limit;
                console.log(query)
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
                data.content.docs = result;
                data.content.totalDocs = total;
                data.content.limit = options.limit;
                data.content.page = page;
                data.content.totalPages = Math.ceil(total / options.limit) || 1;
              }
              if (["item", "product", "detail"].includes(req.params.view)) {
                let urlComponent = req.params.param;
                let document = await Item.getDocument(urlComponent, 'view', false, "urlComponent");
                if (document) {
                  await document.autoPopulate();

                  // Meta
                  data.page.metaTitle = document.metaTitle;
                  data.page.metaDescription = document.metaDescription;
                  data.page.metaKeywords = document.metaKeywords;

                  data.content = document;
                }


              }
            } else {
              const page = shop.pages.find(p => { if ((p.languages || []).includes(data.page.language) && (`/${data.page.language}/${p.urlComponent}` == req.path || `/${p.urlComponent}` == req.path)) return true; })

              if (page) {
                data.content = page.html;
                data.page.title = page.name;
                // Meta
                data.page.metaTitle = page.metaTitle;
                data.page.metaDescription = page.metaDescription;
                data.page.metaKeywords = page.metaKeywords;
                req.params.view = page.template;
              } else {
                // set 404 page
                req.params.view = "404";
              }

            }
          }


        }

      } catch (error) {

        res.send(error)
        return next(error);
      }
      hostingi18n.configure({
        directory: path.join(views, "/locales")
      });
      hostingi18n.setLocale(req.cookies.language || req.locale);

      try {

        ejs.renderFile(
          filepath,
          { data: data, view: req.params.view, i18n: hostingi18n },
          (err, result) => {
            if (err) throw err;
            if (!req.cookies.language || data.page.language != req.cookies.language)
              res.cookie('language', data.page.language);


            res.setHeader('content-type', 'text/html');
            res.setHeader('cache-control', "no-store, no-cache, must-revalidate, proxy-revalidate");
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0'); // Można również użyć daty w przeszłości
            // res.writeHead(200, 'Ok');
            res.send(result);
            // res.end();
          }
        );
      } catch (error) {
        return next(error);
      }



    }
  }


  public async sitemaps(req: Request, res: Response, next: NextFunction) {
    const expm_sitemap = `
  <sitemapindex xmlns="http://www.google.com/schemas/sitemap/0.84">
<script/>
<sitemap>
<loc>https://www.google.com/gmail/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/forms/sitemaps.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/slides/sitemaps.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/sheets/sitemaps.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/drive/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/docs/sitemaps.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/get/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/travel/flights/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/admob/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/business/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/services/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/partners/about/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/adwords/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/search/about/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/adsense/start/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/retail/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/sitemap_search.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/webmasters/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/chromebook/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/chrome/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/calendar/about/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/photos/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/nonprofits/sitemap.xml</loc>
</sitemap>
<sitemap>
<loc>https://www.google.com/finance/sitemap.xml</loc>
</sitemap>
</sitemapindex>
  `

    res.setHeader('content-type', 'application/xml');
    res.send(expm_sitemap);
  }

  public async sitemap(req: Request, res: Response, next: NextFunction) {

    const expm_sitemap = `

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

   <url>

      <loc>http://www.example.com/</loc>

      <lastmod>2005-01-01</lastmod>

      <changefreq>monthly</changefreq>

      <priority>0.8</priority>

   </url>

   <url>

      <loc>http://www.example.com/catalog?item=12&amp;desc=vacation_hawaii</loc>

      <changefreq>weekly</changefreq>

   </url>

   <url>

      <loc>http://www.example.com/catalog?item=73&amp;desc=vacation_new_zealand</loc>

      <lastmod>2004-12-23</lastmod>

      <changefreq>weekly</changefreq>

   </url>

   <url>

      <loc>http://www.example.com/catalog?item=74&amp;desc=vacation_newfoundland</loc>

      <lastmod>2004-12-23T18:00:15+00:00</lastmod>

      <priority>0.3</priority>

   </url>

   <url>

      <loc>http://www.example.com/catalog?item=83&amp;desc=vacation_usa</loc>

      <lastmod>2004-11-23</lastmod>

   </url>

</urlset>
    `;
    res.setHeader('content-type', 'application/xml');
    res.send(expm_sitemap);
  }


}
