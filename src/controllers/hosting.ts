import { Request, Response, NextFunction, RequestHandler } from "express";
import url from "url"
import fs from "fs";
import ejs from "ejs";
import path from "path";
import { I18n } from "i18n";
import Item, { ItemTypes } from "../models/items/model";
import Shop from "../models/ecommerce/shop.model";
import CustomError from "../utilities/errors/customError";
import { IItem } from "../models/items/schema.js";
import Transaction from "../models/transactions/schema.js";
import { IRelated } from "../models/items/related.schema.js";
import cache from "../config/cache.js";
import Customer from "../models/entities/customer/schema.js";
import mongoose from "mongoose";
import { IPage } from "../models/ecommerce/page.schema.js";
import Group from "../models/classifications/group/schema.js";
import Category from "../models/classifications/category/schema.js";
import SalesOrder from "../models/transactions/salesOrder/schema.js";


export default class controller {
  public async setLanguage(req: Request, res: Response, next: NextFunction) {
    const language = req.params.language;
    res.cookie('language', language, { maxAge: 900000, httpOnly: true });
    res.redirect('back');
  }
  public async setCurrency(req: Request, res: Response, next: NextFunction) {
    const currency = req.params.currency;
    res.cookie('currency', currency, { maxAge: 900000, httpOnly: true });
    res.redirect('back');
  }
  public async get(req: Request, res: Response, next: NextFunction) {
    //i18n
    const hostingi18n = new I18n();

    let hostingPath = path.resolve("hosting");
    let views = path.resolve(hostingPath, req.body.pointer || req.subdomains[0]);

    // check if exists shop - to do (customize template)
    let shop = await Shop.getDocument(req.body.pointer || req.subdomains[0], "simple", true, "subdomain")
    if (shop) {
      await shop.autoPopulate()
      views = path.resolve("templates", shop.template);
    }
    else throw new CustomError("doc_not_found", 404);
    let viewpath = path.join(views, "views", req.params.view + ".ejs");

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
      let data: any = { info: {}, page: {}, template: {}, content: null };

      //cookes
      const shoppingcart = req.cookies.shoppingcart ? cache.get(req.cookies.shoppingcart) : null
      const user = req.cookies.user ? await Customer.getDocument(req.cookies.user, "simple", true) : null

      //shoppingcart
      data["shoppingCart"] = shoppingcart;
      // logged user
      if (user) data["user"] = {
        name: user.name,
        favoriteItems: user.favoriteItems.length
      };


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
        currency: shop.currencies.includes(req.cookies.currency) ? req.cookies.currency : shop.currencies[0],
        defaultLanguage: shop.languages[0],
        name: shop.name,
        description: shop.description,
        logo: shop.logo,
        image: shop.image,
        message: shop.message,
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
        facebookUrl: shop.facebookUrl,
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
        pages: Object.values(shop.pages.filter(p => (p.languages || []).includes(data.page.language) && p.topBar).reduce((t: any, p) => {

          let page = {
            urlComponent: p.urlComponent,
            path: `${data.page.host}/${p.urlComponent}`,
            name: p.name,
            parentPage: (p.parentPage as any)?._id // do porpawy
          }

          t[p._id.toString()] = t[p._id.toString()] || { ...page, pages: [] }
          if (page.parentPage) {
            if (t[page.parentPage.toString()]) t[page.parentPage.toString()].pages.push(page)
          }
          return t;
        }, {})).filter((page: any) => !page.parentPage)

      }
      data["footer"] = {
        address: shop.address,
        //pages
        pages: Object.values(shop.pages.filter(p => (p.languages || []).includes(data.page.language) && p.footer).reduce((t: any, p) => {

          let page = {
            urlComponent: p.urlComponent,
            path: `${data.page.host}/${p.urlComponent}`,
            name: p.name,
            parentPage: (p.parentPage as any)?._id // do porpawy
          }

          t[p._id.toString()] = t[p._id.toString()] || { ...page, pages: [] }
          if (page.parentPage) {
            if (t[page.parentPage.toString()]) t[page.parentPage.toString()].pages.push(page)
          }
          return t;
        }, {})).filter((page: any) => !page.parentPage)

      }

      //slider on home page
      if (!req.params.view) data["slider"] = {
        //pages
        pages: shop.pages.filter(p => (p.languages || []).includes(data.page.language) && p.slider).map(p => {
          let page = {
            urlComponent: p.urlComponent,
            path: `${data.page.host}/${p.urlComponent}`,
            name: p.name,
            description: p.description,
            image: p.image
          }
          return page
        })
      }
      //banner on home page
      if (!req.params.view) data["banner"] = {
        //pages
        pages: shop.pages.filter(p => (p.languages || []).includes(data.page.language) && p.banner).map(p => {
          let page = {
            urlComponent: p.urlComponent,
            path: `${data.page.host}/${p.urlComponent}`,
            name: p.name,
            description: p.description,
            image: p.image
          }
          return page
        })
      }
      //blog section on home page
      if (!req.params.view) data["blog"] = {
        //pages
        pages: shop.pages.filter(p => (p.languages || []).includes(data.page.language) && p.blog).map(p => {
          let page = {
            urlComponent: p.urlComponent,
            path: `${data.page.host}/${p.urlComponent}`,
            name: p.name,
            description: p.description,
            image: p.image,
            date: p.date.toISOString().substr(0, 10)
          }
          return page
        })
      }

      try {
        // if view params exists
        if (req.params.view) {

          if (req.params.view == "favicon.ico") {
            console.log("favicon.ico not found")
            req.params.view = "404.ejs"
          } else {



            if (["konto", "account"].includes(req.params.view)) {
              if (req.cookies.user)
                data.content = await Customer.getDocument(req.cookies.user, "simple", true)
              else {
                res.redirect('login');
              }
            }

            if (["wishlist"].includes(req.params.view)) {
              if (user) {
                await user.autoPopulate();
                data.content = user.favoriteItems || {}
              } else {
                res.redirect('login');
              }
            }

            if (["news"].includes(req.params.view)) {
              let result = shop.pages.filter(p => (p.languages || []).includes(data.page.language) && p.blog).map(p => {
                let page = {
                  urlComponent: p.urlComponent,
                  path: `${data.page.host}/${p.urlComponent}`,
                  name: p.name,
                  description: p.description,
                  image: p.image,
                  date: p.date.toISOString().substr(0, 10)
                }
                return page
              })
              data.content = { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 1, filters: [] };
              data.content.docs = result;
              data.content.totalDocs = result.length;
              data.content.limit = result.length;
              data.content.page = 1;
              data.content.totalPages = 1;
            }

            if (["shoppingcart", "basket", "cart", "checkout", "kasa", "summary"].includes(req.params.view)) {
              if (req.cookies.shoppingcart)
                data.content = cache.get(req.cookies.shoppingcart)

              if (!data.content) data.content = { message: "empty_shoppingcart" }
            }
            if (["order", "zamowienie"].includes(req.params.view)) {
              if (req.params.param) {
                let document = await SalesOrder.getDocument(req.params.param, "simple", true)
                if (document) data.content = await document.autoPopulate()
              }

              if (!data.content) data.content = { message: "order_not_found" }

            }
            if (["register"].includes(req.params.view)) {
              if (req.params.id) {
                let Entity = mongoose.model("customer");
                const customer = await Entity.findById(req.params.id, { _id: true, email: true })
                if (customer) {

                  // zmiana statusu na potwierdzony
                  await shop.sendEmail("registration_confirmed", req.locale, customer.email, customer)
                  data.content = { status: "success", message: "email_confirmed" };

                }
              }
            }
            if (["resetpassword"].includes(req.params.view)) {
              if (req.params.id) {
                let Entity = mongoose.model("customer");
                const customer = await Entity.findById(req.params.id, { _id: true, email: true })
                if (customer) {
                  data.content = { status: "success", message: "set_password" };
                }
              }
            }


            if (fs.existsSync(viewpath)) {
              if (["search", "products", "items"].includes(req.params.view)) {

                data.content = { docs: [], totalDocs: 0, limit: 0, page: 1, totalPages: 1, filters: [] };
                let query = {};
                if (req.query.keyword) {
                  query['name'] = { $regex: `.*${req.query.keyword}.*`, $options: 'i' };
                };

                if (req.query.group) {
                  let filter: any[] = [];
                  if (!Array.isArray(req.query.group)) filter = [req.query.group];
                  else filter = req.query.group;

                  const filterGroup = (await Group.find({ urlComponent: { $in: filter } }, { _id: 1 })).map(g => g._id)
                  query["group"] = { $in: filterGroup }
                }
                // if (req.query.manufacturer) {
                //   let filter: any[] = [];
                //   if (!Array.isArray(req.query.manufacturer)) filter = [req.query.manufacturer];
                //   else filter = req.query.manufacturer;

                //   query["manufacturer"] = { $in: filter }
                // }
                if (req.params.param && req.params.param) {
                  const filterCategory = (await Category.find({ urlComponent: { $in: req.params.param } }, { _id: 1 })).map(c => c._id)
                  query["category"] = { $in: filterCategory }
                }

                if (req.query.price) {
                  // uzupełnił logiką
                }

                // let filters = (req.query.filters || "").toString();
                // if (filters) {
                //   query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
                // }

                let options = { sort: {}, limit: 0, skip: 0, select: { name: 1, description: 1, urlComponent: 1, images: 1, "images.fullPath": 1, "images.path": 1, "images.urlComponent": 1 } };
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
                options.limit = Math.min(parseInt((req.query.limit || req.cookies.limit || 10).toString()), 100);
                options.skip = ((page || 1) - 1) * options.limit;

                let result = await Item.findDocuments(query, options);
                let total = await Item.countDocuments(query)
                for (let index in result) {
                  let price: IItem = await result[index].getPrice()
                  result[index] = await result[index].constantTranslate(req.locale);

                  // tymczasowe dane
                  result[index].quantityAvailable = Math.floor(Math.random() * 10);
                  result[index].price = price//Math.floor(Math.random() * 1000) + 40;
                  result[index].currency = data.page.currency;
                  result[index].priceFormat = new Intl.NumberFormat('en-EN', { style: 'currency', currency: data.page.currency }).format(result[index].price);
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

                // zapisywanie domyślnych ustawień
                res.cookie('limit', options.limit, { maxAge: 900000, httpOnly: true });

                //available filters
                data.content.filters = [];
                const category = await Category.find({}, { name: 1, urlComponent: 1 })
                data.content.filters.push({
                  field: 'category',
                  type: 'select',
                  multiple: false,
                  params: true,
                  options: category,
                  example: '/search/4x4',
                  value: req.params.param
                })
                const group = await Group.find({}, { name: 1, urlComponent: 1 })
                data.content.filters.push({
                  field: 'group',
                  type: 'select',
                  multiple: true,
                  params: false,
                  options: group,
                  example: '/search/?group=group1&group=group2',
                  example2: '/search/performance/?group=group1&group=group2',
                  value: req.query.group ? Array.isArray(req.query.group) ? req.query.group : [req.query.group] : []
                })

                // data.content.filters.push({
                //   field: 'manufacturer',
                //   type: 'select',
                //   multiple: true,
                //   params: false,
                //   options: [],
                //   example: '/search/?manufacturer=dba'
                // })
                data.content.filters.push({
                  field: 'price',
                  type: 'range',
                  multiple: false,
                  params: false,
                  options: [0, 5000],
                  example: '/search/?price=100-450'
                })
              }
              if (["item", "product", "detail"].includes(req.params.view)) {
                let urlComponent = req.params.param;
                let document = await Item.getDocument(urlComponent, 'view', false, "urlComponent");
                if (document) {
                  await document.autoPopulate();

                  data.page.name = document.name;
                  if ('sku' in document) data.page.sku = document.sku;
                  data.page.description = document.description;

                  // Meta
                  data.page.metaTitle = document.metaTitle;
                  data.page.metaDescription = document.metaDescription;
                  data.page.metaKeywords = document.metaKeywords;


                  // tymczasowe dane
                  let doc = document.toObject({ getters: true, virtuals: true });

                  // relatedItem

                  doc.relatedItems = [] as any[]

                  doc["relatedItems"] = await Promise.all(
                    document["relatedItems"].map(async (related: IRelated) => {
                      let item = related.related.toObject();
                      item["quantityAvailable"] = Math.floor(Math.random() * 10);
                      item["price"] = await related.related.getPrice();
                      item["currency"] = data.page.currency;
                      item["priceFormat"] = new Intl.NumberFormat('en-EN', { style: 'currency', currency: data.page.currency }).format(item["price"]);
                      item["grossPrice"] = false;
                      return item
                    })
                  )

                  doc["quantityAvailable"] = Math.floor(Math.random() * 10);
                  doc["price"] = await document.getPrice()
                  doc["currency"] = data.page.currency;
                  doc["priceFormat"] = new Intl.NumberFormat('en-EN', { style: 'currency', currency: data.page.currency }).format(doc["price"]);
                  doc["grossPrice"] = false;

                  data.content = doc;
                } else {
                  req.params.view = "404";
                }

              }

            }

            if (!data.content) {
              const page = shop.pages.find(p => { if ((p.languages || []).includes(data.page.language) && (`/${data.page.language}/${p.urlComponent}` == req.path || `/${p.urlComponent}` == req.path)) return true; })

              if (page) {
                data.content = page.html;
                data.page.name = page.name;
                data.page.description = page.description;

                data.page.image = page.image;

                // Meta
                data.page.metaTitle = page.metaTitle;
                data.page.metaDescription = page.metaDescription;
                data.page.metaKeywords = page.metaKeywords;
                req.params.view = page.template;
                viewpath = path.join(views, "views", req.params.view);
              } else {
                // set 404 page
                req.params.view = "404";
              }

            } else {
              if (!fs.existsSync(viewpath)) {
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
        directory: path.join(views, "/locales"),
        objectNotation: true
      });
      hostingi18n.setLocale(req.cookies.language || req.locale);
      try {

        if (fs.existsSync(viewpath) || !req.params.view || !data.content) {
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
        } else {
          res.json({ viewpath, data });
        }
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
