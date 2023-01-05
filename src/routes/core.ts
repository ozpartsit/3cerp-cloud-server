import mongoose from "mongoose";
import subdomain from "express-subdomain";
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";
import WarehouseController from "../controllers/warehouses";
import ClassificationController from "../controllers/classifications";
import EntityController from "../controllers/entities";
import TransactionController from "../controllers/transactions";
import ItemController from "../controllers/items";
import ConstantController from "../controllers/constants";
import FilesController from "../controllers/files";
import HostingController from "../controllers/hosting";

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
    this.routeAuth();
    this.routeFiles();
    this.routeHosting();
    this.routeCustom();
    //app.use(subdomain("hosting", this.Router2));
    app.use("/hosting", this.Router2);
    app.use("/core", this.Router);
    app.use("/files", this.RouterFiles);
    //Custom
    app.use("/custom", this.RouterCustom);
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
    this.Router2.route("/:page/:view?").get(
      this.hostingController.get as any
    );
  }
}
