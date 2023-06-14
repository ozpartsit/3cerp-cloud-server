import mongoose from "mongoose";
//import subdomain from "express-subdomain";
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";
import WarehouseController from "../controllers/warehouses";
import ClassificationController from "../controllers/classifications";
import EntityController from "../controllers/entities";
import TransactionController from "../controllers/transactions";
import ItemController from "../controllers/items";
import ActivityController from "../controllers/activities";
import WebsiteController from "../controllers/websites";
import ConstantController from "../controllers/constants";
import FilesController from "../controllers/files";
import HostingController from "../controllers/hosting";
import EmailController from "../controllers/emails";
import SettingController from "../controllers/settings";
import ReportController from "../controllers/reports";
import shop, { IShop } from "../models/shop.model";

export default class Routes {
  public Router: express.Router = express.Router();
  public Router2: express.Router = express.Router();
  public RouterFiles: express.Router = express.Router();
  public RouterCustom: express.Router = express.Router();
  public Auth: Auth = new Auth();
  public entityController: EntityController = new EntityController();
  public classificationController: ClassificationController = new ClassificationController();
  public warehouseController: WarehouseController = new WarehouseController();
  public transactionController: TransactionController = new TransactionController();
  public websiteController: WebsiteController = new WebsiteController();
  public itemController: ItemController = new ItemController();
  public activityController: ActivityController = new ActivityController();
  public constantController: ConstantController = new ConstantController();
  public filesController: FilesController = new FilesController();
  public hostingController: HostingController = new HostingController();
  public emailController: EmailController = new EmailController();
  public settingController: SettingController = new SettingController();
  public reportController: ReportController = new ReportController();

  public start(app: express.Application): void {
    console.log("Start Routing");
    this.routeConstants();
    this.routeTransactions();
    this.routeWarehouses();
    this.routeClassifications();
    this.routeItems();
    this.routeActivities();
    this.routeUsers();
    this.routeWebsites();
    this.routeAuth();
    this.routeFiles();
    this.routeHosting();
    this.routeCustom();
    this.routeEmails();
    this.routeSettings();
    this.routeReports();
    app.use(subdomain("*", this.Router2));
    //app.use("/hosting", this.Router2);
    app.use("/api/core", this.Router);
    //app.use("/api/core/storage", this.RouterFiles);
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
    this.Router.route("/classifications/:recordtype/new/create").post(
      this.classificationController.add.bind(this.classificationController) as any
    );

    this.Router.route("/classifications/:recordtype/:id/:mode")
      .get(this.classificationController.get.bind(this.classificationController) as any)
      .put(this.classificationController.update.bind(this.classificationController) as any)
      .post(this.classificationController.save.bind(this.classificationController) as any)
      .delete(this.classificationController.delete.bind(this.classificationController) as any);
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
    this.Router.route("/transactions/:recordtype/:id/pdf").get(
      this.transactionController.pdf.bind(this.transactionController) as any
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
      .post(this.itemController.save.bind(this.itemController) as any)
      .delete(this.itemController.delete.bind(this.itemController));
  }
  public routeActivities() {
    //Activities
    this.Router.route("/activities/").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.activityController.find.bind(this.activityController) as any
    );
    this.Router.route("/activities/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.activityController.find.bind(this.activityController) as any
    );
    this.Router.route("/activities/:recordtype/new/create").post(
      this.activityController.add.bind(this.activityController) as any
    );
    this.Router.route("/activities/:recordtype/:id/:mode")
      .get(this.activityController.get.bind(this.activityController))
      .put(this.activityController.update.bind(this.activityController))
      .post(this.activityController.save.bind(this.activityController) as any)
      .delete(this.activityController.delete.bind(this.activityController));
  }
  public routeUsers() {
    // Users
    // this.Router.route("/entities/:recordtype/:id/options").get(
    //   this.Auth.authenticate.bind(this.Auth) as any,
    //   this.entityController.options.bind(this.entityController) as any
    // );

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
      .put(this.websiteController.update.bind(this.websiteController) as any)
      .post(this.websiteController.save.bind(this.websiteController) as any)
      .delete(this.websiteController.delete.bind(this.websiteController) as any);
  }
  public routeEmails() {
    // Emails
    this.Router.route("/emails/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.emailController.find.bind(this.emailController) as any
    );

    this.Router.route("/emails/:recordtype/new/create").post(
      this.emailController.add.bind(this.emailController) as any
    );

    this.Router.route("/emails/:recordtype/:id/send")
      .post(this.emailController.send.bind(this.emailController) as any)

    this.Router.route("/emails/:recordtype/:id/:mode")
      .get(this.emailController.get.bind(this.emailController) as any)
      .put(this.emailController.update.bind(this.emailController) as any)
      .post(this.emailController.save.bind(this.emailController) as any)
      .delete(this.emailController.delete.bind(this.emailController) as any);
  }
  public routeSettings() {
    // Settings

    this.Router.route("/settings/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.settingController.find.bind(this.settingController) as any
    );

    this.Router.route("/settings/:recordtype/new/create").post(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.settingController.add.bind(this.settingController) as any
    );

    // this.Router.route("/settings/:recordtype/new/create").post(
    //   this.settingController.add.bind(this.settingController) as any
    // );

    this.Router.route("/settings/:recordtype/:id/:mode?")
      .put(this.settingController.update.bind(this.settingController) as any)
    // .get(this.settingController.get.bind(this.settingController) as any)

    //   .post(this.settingController.save.bind(this.settingController) as any)
    //   .delete(this.settingController.delete.bind(this.settingController) as any);
  }
  public routeReports() {
    // Reports
    this.Router.route("/reports/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.reportController.find.bind(this.reportController) as any
    );

    this.Router.route("/reports/:recordtype/new/create").post(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.reportController.add.bind(this.reportController) as any
    );

    this.Router.route("/reports/:recordtype/:id/results")
      .get(this.reportController.results.bind(this.reportController) as any)

    this.Router.route("/reports/:recordtype/:id/:mode?")
      .put(this.reportController.update.bind(this.reportController) as any)
      .get(this.reportController.get.bind(this.reportController) as any)
      .post(this.reportController.save.bind(this.reportController) as any)
      .delete(this.reportController.delete.bind(this.reportController) as any);
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
    this.Router.route("/files/upload/:path*?").post(
      this.filesController.upload.bind(this.filesController) as any
    );
    this.Router.route("/files/:path*?").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.filesController.find.bind(this.filesController) as any
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