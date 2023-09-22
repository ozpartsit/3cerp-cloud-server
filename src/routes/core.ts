
import Auth from "../middleware/auth";
import subdomain from "../middleware/subdomain";
import express, { Request, Response, NextFunction } from "express";
import Controller from "../controllers/genericController";

import TransactionController from "../controllers/transactions";
import WebsiteController from "../controllers/websites";
import ConstantController from "../controllers/constants";
import FilesController from "../controllers/files";
import HostingController from "../controllers/hosting";
import EmailController from "../controllers/emails";
import AccountController from "../controllers/accounts";

// External Services
import DPDController from "../controllers/external/dpd";

import Account from "../models/account.model";
import User from "../models/user.model";
import Preference from "../models/preference.model";

import { StorageTypes } from "../models/storages/model";
import { TransactionTypes } from "../models/transactions/model";
import { ItemTypes } from "../models/items/model";
import { EntityTypes } from "../models/entities/model";
import Email from "../models/email.model";
import Shop from "../models/shop.model";

export default class Routes {
  public Router: express.Router = express.Router();
  public RouterHosting: express.Router = express.Router();
  public RouterFiles: express.Router = express.Router();
  public RouterDPD: express.Router = express.Router();


  public Auth: Auth = new Auth();
  public websiteController = new WebsiteController(Shop);
  public constantController: ConstantController = new ConstantController();
  public hostingController: HostingController = new HostingController();
  public emailController = new EmailController(Email);
  public accountController = new AccountController(Account);

  public dpdController = new DPDController();

  public start(app: express.Application): void {
    console.log("Start Routing");

    //Accounts
    this.routeUniversal("accounts", "account", this.accountController)
    //Users
    this.routeUniversal("users", "user", new Controller(User))
    //Preferences
    this.routeUniversal("preferences", "preference", new Controller(Preference))

    //Storage
    Object.values(StorageTypes).forEach(async (storage) => {
      this.routeUniversal(storage.collection.collectionName, storage.modelName, new Controller(storage))
    })
    //Upload
    this.routeFiles(new FilesController(StorageTypes.folder))

    //Transactions
    Object.values(TransactionTypes).forEach(transaction => {
      this.routeUniversal(transaction.collection.collectionName, transaction.modelName, new TransactionController(transaction))
    })
    //Items
    Object.values(ItemTypes).forEach(item => {
      this.routeUniversal(item.collection.collectionName, item.modelName, new Controller(item))
    })
    //Entities
    Object.values(EntityTypes).forEach(entity => {
      this.routeUniversal(entity.collection.collectionName, entity.modelName, new Controller(entity))
    })
    // Emails
    this.routeUniversal("emails", "email", this.emailController);
    // website
    this.routeUniversal("websites", "webshop", this.websiteController)
    // constatns
    this.routeConstants();
    //Auth
    this.routeAuth();
    this.routeHosting();

    this.routerDPD();

    app.use(subdomain("*", this.RouterHosting));
    app.use("/api/core", this.Router);
    app.use("/api/dpd", this.RouterDPD);
  }

  public routerDPD() {
    // DPD
    this.RouterDPD.route("/shipment/:param?").post(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.dpdController.shipment.bind(this.dpdController) as any
    );
  }


  public routeUniversal(collection: string, recordtype: string, controller: any) {
    let path = (`/${collection}/${recordtype}`).toLowerCase();
    this.Router.route(`${path}/fields`).get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
      controller.fields.bind(controller) as any
    );
    this.Router.route(`${path}/form`).get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
      controller.form.bind(controller) as any
    );
    this.Router.route(`${path}`).get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
      controller.find.bind(controller) as any
    );

    this.Router.route(`${path}/new/:mode?`).post(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
      controller.add.bind(controller) as any
    );
    if (controller.pdf)
      this.Router.route(`${path}/:id/pdf`).get(
        this.Auth.authenticate.bind(this.Auth) as any,
        this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
        controller.pdf.bind(controller) as any
      );

    this.Router.route(`${path}/:id/logs`).get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
      controller.logs.bind(controller) as any
    );

    this.Router.route(`${path}/:id/:mode?`)
      .get(
        this.Auth.authenticate.bind(this.Auth) as any,
        this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
        controller.get.bind(controller) as any
      )
      .patch(
        this.Auth.authenticate.bind(this.Auth) as any,
        this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
        controller.update.bind(controller) as any
      )
      .put(
        this.Auth.authenticate.bind(this.Auth) as any,
        this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
        controller.save.bind(controller) as any
      )
      .delete(
        this.Auth.authenticate.bind(this.Auth) as any,
        this.Auth.authorization(collection, recordtype).bind(this.Auth) as any,
        controller.delete.bind(controller) as any
      );
  }

  public routeConstants() {
    // Constants
    this.Router.route("/constants/:recordtype").get(
      this.constantController.get as any
    );
  }


  public routeAuth() {
    // Auth
    this.Router.route("/auth/login").post(this.Auth.login.bind(this.Auth) as any);
    this.Router.route("/auth/token").post(this.Auth.login.bind(this.Auth) as any);

    this.Router.route("/auth/refresh").post(
      this.Auth.refreshToken.bind(this.Auth) as any
    );

    this.Router.route("/auth/user").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.getUser.bind(this.Auth) as any
    );

    this.Router.route("/auth/access/:collection/:recordtype/:id?/:mode?").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization().bind(this.Auth) as any,
      this.Auth.accessGranted.bind(this.Auth) as any
    );
    this.Router.route("/auth/acesss").post(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization.bind(this.Auth) as any,
      this.Auth.accessGranted.bind(this.Auth) as any
    );

    this.Router.route("/auth/reset_password")
      .post(this.Auth.resetPassword.bind(this.Auth) as any)
      .patch(this.Auth.setPassword.bind(this.Auth) as any);

    this.Router.route("/auth/signup")
      .post(this.Auth.contactForm.bind(this.Auth) as any);

  }
  public routeFiles(controller) {
    // Files
    this.Router.route("/storage/upload").post(
      this.Auth.authenticate.bind(this.Auth) as any,
      controller.upload.bind(controller) as any
    );
  }
  public routeHosting() {
    // Hosting
    this.RouterHosting.route("/:view?/:param?").get(
      this.hostingController.get as any
    );
    this.RouterHosting.route("*").get(
      this.hostingController.get as any
    );
  }

}

