import mongoose from "mongoose";
//import subdomain from "express-subdomain";
import Auth from "../middleware/auth";
import Hosting from "../middleware/hosting";
import express, { Request, Response, NextFunction } from "express";
import WarehouseController from "../controllers/warehouses";
import ClassificationController from "../controllers/classifications";
import EntityController from "../controllers/entities";
import TransactionController from "../controllers/transactions";
import ItemController from "../controllers/items";
import WebsiteController from "../controllers/websites";
import ConstantController from "../controllers/constants";
import FilesController from "../controllers/files";
import HostingController from "../controllers/hosting";
import shop, { IShop } from "../models/shop.model";

export default class Routes {
  public Router: express.Router = express.Router();
  public Router2: express.Router = express.Router();
  public RouterFiles: express.Router = express.Router();
  public RouterCustom: express.Router = express.Router();
  public Auth: Auth = new Auth();
  public Hosting: Hosting = new Hosting();
  public entityController: EntityController = new EntityController();
  public classificationController: ClassificationController = new ClassificationController();
  public warehouseController: WarehouseController = new WarehouseController();
  public transactionController: TransactionController = new TransactionController();
  public websiteController: WebsiteController = new WebsiteController();
  public itemController: ItemController = new ItemController();
  public constantController: ConstantController = new ConstantController();
  public filesController: FilesController = new FilesController();
  public hostingController: HostingController = new HostingController();

  public start(app: express.Application): void {
    console.log("Start Routing");
    this.routeConstants();
    this.routeTransactions();
    this.routeWarehouses();
    this.routeClassifications();
    this.routeItems();
    this.routeUsers();
    this.routeWebsites();
    this.routeAuth();
    this.routeFiles();
    this.routeHosting();
    this.routeCustom();

    app.use(subdomain("*", this.Router2));
    //app.use("/hosting", this.Router2);
    app.use("/api/core", this.Router);
    app.use("/storage/files", this.RouterFiles);
    //Custom
    app.use("/api/custom", this.RouterCustom);
  }

  public routeCustom() {
    // Constants
    this.RouterCustom.route("/items").get(
      async function (req, res) {

        // let db = mongoose.connection.db;
        // let items = await db.collection('items').find().toArray();
        // console.log(items.length)
        // if (items.length) {
        //   let tmp = await db.collection('transactions.lines').findOne();
        //   if (tmp) {

        //     for (let item of items) {
        //       console.log(item.name);
        //       await db.collection('items').updateOne({ name: item.name }, { $set: { type: 'InvItem' } })
        //       delete tmp._id;
        //       tmp.item = item._id;
        //       await db.collection('transactions.lines').insertOne(tmp);
        //     }
        //   }
        // }
      }
    );
  }


  public routeConstants() {
    // Constants
    this.Router.route("/constants/:recordtype").get(
      this.constantController.get as any
    );
  }

  public routeWarehouses() {
    // Warehouses
    this.Router.route("/warehouses/:recordtype").get(
      this.warehouseController.find.bind(this.warehouseController) as any
    );
  }
  public routeClassifications() {
    // Classifications
    this.Router.route("/classifications/:recordtype").get(
      this.classificationController.find.bind(this.classificationController) as any
    );
  }
  public routeTransactions() {
    // Transactions
    this.Router.route("/transactions/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.transactionController.find.bind(this.transactionController) as any
    );

    this.Router.route("/transactions/:recordtype/new/create").post(
      this.transactionController.add.bind(this.transactionController) as any
    );

    this.Router.route("/transactions/:recordtype/:id/:mode")
      .get(this.transactionController.get.bind(this.transactionController) as any)
      .put(this.transactionController.update.bind(this.transactionController) as any)
      .post(this.transactionController.save.bind(this.transactionController) as any)
      .delete(this.transactionController.delete.bind(this.transactionController) as any);
  }
  public routeItems() {
    //Items
    this.Router.route("/items/").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.itemController.find.bind(this.itemController) as any
    );
    this.Router.route("/items/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.itemController.find.bind(this.itemController) as any
    );
    this.Router.route("/items/:recordtype/new/create").post(
      this.itemController.add.bind(this.itemController) as any
    );
    this.Router.route("/items/:recordtype/:id/:mode")
      .get(this.itemController.get.bind(this.itemController))
      .put(this.itemController.update.bind(this.itemController))
      .delete(this.itemController.delete.bind(this.itemController));
  }
  public routeUsers() {
    // Users
    this.Router.route("/entities/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.entityController.find.bind(this.entityController) as any
    );

    this.Router.route("/entities/:recordtype/new/create").post(
      this.entityController.add.bind(this.entityController) as any
    );

    this.Router.route("/entities/:recordtype/:id/:mode")
      .get(this.entityController.get.bind(this.entityController) as any)
      .put(this.entityController.update.bind(this.entityController) as any)
      .post(this.entityController.save.bind(this.entityController) as any)
      .delete(this.entityController.delete.bind(this.entityController) as any);
  }
  public routeWebsites() {
    // Websites
    this.Router.route("/websites/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.websiteController.find.bind(this.websiteController) as any
    );

    this.Router.route("/websites/:recordtype/new/create").post(
      this.websiteController.add.bind(this.websiteController) as any
    );

    this.Router.route("/websites/:recordtype/:id/:mode")
      .get(this.websiteController.get.bind(this.websiteController) as any)
      .put(this.Hosting.mapShops.bind(this.Hosting) as any, this.websiteController.update.bind(this.websiteController) as any)
      .post(this.Hosting.mapShops.bind(this.Hosting) as any, this.websiteController.save.bind(this.websiteController) as any)
      .delete(this.Hosting.mapShops.bind(this.Hosting) as any, this.websiteController.delete.bind(this.websiteController) as any);
  }
  public routeAuth() {
    // Auth
    this.Router.route("/login").post(this.Auth.login.bind(this.Auth) as any);
    this.Router.route("/auth").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.accessGranted.bind(this.Auth) as any
    );
  }
  public routeFiles() {
    // Files
    this.RouterFiles.route("/:path*?").get(
      this.Auth.authenticate as any,
      this.filesController.get as any
    );
    this.RouterFiles.route("/upload").post(
      this.Auth.authenticate as any,
      this.filesController.add as any
    );
  }
  public routeHosting() {
    // Hosting
    this.Router2.route("/:view?/:param?").get(
      this.hostingController.get as any
    );
    this.Router2.route("*").get(
      this.hostingController.get as any
    );
  }
}


function subdomain(subdomain: string, fn: any) {
  if (!subdomain || typeof subdomain !== "string") {
    throw new Error("The first parameter must be a string representing the subdomain");
  }

  //check fn handles three params..
  if (!fn || typeof fn !== "function" || fn.length < 3) {
    throw new Error("The second parameter must be a function that handles fn(req, res, next) params.");
  }
  return async function (req: any, res: any, next: NextFunction) {

    // domain pointer redirect to hosting

    let website = await shop.findOne({ domain: req.hostname });
    if (website) {
      req.body.pointer = website.subdomain;
    }

    req._subdomainLevel = req._subdomainLevel || 0;

    var subdomainSplit = subdomain.split('.');
    var len = subdomainSplit.length;
    var match = true;

    //url - v2.api.example.dom
    //subdomains == ['api', 'v2']
    //subdomainSplit = ['v2', 'api']
    for (var i = 0; i < len; i++) {
      var expected = subdomainSplit[len - (i + 1)];
      var actual = req.subdomains[i + req._subdomainLevel];
      if (actual === "www") actual = false;
      if (expected === '*') { continue; }

      if (actual !== expected) {
        match = false;
        break;
      }
    }
    if ((actual || req.body.pointer) && match) {

      req._subdomainLevel++;//enables chaining
      return fn(req, res, next);
    } else {
      if (actual) res.send("ok")
      else next();
    }

  };
}