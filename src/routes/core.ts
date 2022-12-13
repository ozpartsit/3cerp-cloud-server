import subdomain from "express-subdomain";
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";
import WarehouseController from "../controllers/warehouses";
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
  public Auth: Auth = new Auth();
  public entityController: EntityController = new EntityController();
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
    this.routeItems();
    this.routeUsers();
    this.routeAuth();
    this.routeFiles();
    this.routeHosting();
    //app.use(subdomain("hosting", this.Router2));
    app.use("/hosting", this.Router2);
    app.use("/core", this.Router);
    app.use("/files", this.RouterFiles);
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

  public routeTransactions() {
    // Transactions
    this.Router.route("/transactions/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.transactionController.find.bind(this.transactionController) as any
    );
    // this.Router.route("/transactions/:recordtype").post(
    //   this.transactionController.add as any
    // );
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
    this.Router.route("/items/:recordtype").post(
      this.itemController.add.bind(this.itemController) as any
    );
    this.Router.route("/items/:recordtype/:id")
      .get(this.itemController.get.bind(this.itemController))
      .put(this.itemController.update.bind(this.itemController))
      .delete(this.itemController.delete.bind(this.itemController));
  }
  public routeUsers() {
    // Users
    this.Router.route("/entities/").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.entityController.find.bind(this.entityController) as any
    );
    this.Router.route("/entities/:recordtype").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.entityController.find.bind(this.entityController) as any
    );
    this.Router.route("/entities/:recordtype").post(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.entityController.add.bind(this.entityController) as any
    );
    this.Router.route("/entities/:recordtype/:id")
      .get(this.Auth.authenticate.bind(this.Auth) as any, this.entityController.get.bind(this.entityController))
      .put(this.Auth.authenticate.bind(this.Auth) as any, this.entityController.update.bind(this.entityController))
      .delete(this.Auth.authenticate.bind(this.Auth) as any, this.entityController.delete.bind(this.entityController));
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
