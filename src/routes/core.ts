import mongoose from "mongoose";
//import subdomain from "express-subdomain";
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";
import Controller from "../controllers/genericController";

import TransactionController from "../controllers/transactions";
import WebsiteController from "../controllers/websites";
import ConstantController from "../controllers/constants";
import FilesController from "../controllers/files";
import HostingController from "../controllers/hosting";
import EmailController from "../controllers/emails";

import shop, { IShop } from "../models/shop.model";

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

  public Auth: Auth = new Auth();
  public websiteController = new WebsiteController(Shop);
  public constantController: ConstantController = new ConstantController();
  public hostingController: HostingController = new HostingController();
  public emailController = new EmailController(Email);


  public start(app: express.Application): void {
    console.log("Start Routing");

    //Storage
    Object.values(StorageTypes).forEach(storage => {
      this.routeFiles(new FilesController(storage))
    })
    //Transactions
    Object.values(TransactionTypes).forEach(transaction => {
      this.routeUniversal("transactions", new TransactionController(transaction))
    })
    //Items
    Object.values(ItemTypes).forEach(item => {
      this.routeUniversal("items", new Controller(item))
    })
    //Entities
    Object.values(EntityTypes).forEach(entity => {
      this.routeUniversal("entities", new Controller(entity))
    })

    this.routeUniversal("emails", this.emailController);
    this.routeUniversal("websites", this.websiteController)

    this.routeConstants();
    this.routeAuth();
    this.routeHosting();


    app.use(subdomain("*", this.RouterHosting));
    app.use("/api/core", this.Router);

  }


  public routeUniversal(collection: any, controller: any) {
    this.Router.route(`/${collection}/:recordtype/fields`).get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization(3).bind(this.Auth) as any,
      controller.fields.bind(controller) as any
    );
    this.Router.route(`/${collection}/:recordtype/form`).get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization(3).bind(this.Auth) as any,
      controller.form.bind(controller) as any
    );
    this.Router.route(`/${collection}/:recordtype`).get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.authorization(3).bind(this.Auth) as any,
      controller.find.bind(controller) as any
    );

    this.Router.route(`/${collection}/:recordtype/new/create`).post(
      this.Auth.authorization(3).bind(this.Auth) as any,
      controller.add.bind(controller) as any
    );
    if (controller.pdf)
      this.Router.route(`/${collection}/:recordtype/:id/pdf`).get(
        this.Auth.authorization(3).bind(this.Auth) as any,
        controller.pdf.bind(controller) as any
      );

    this.Router.route(`/${collection}/:recordtype/:id/logs`).get(
      this.Auth.authorization(3).bind(this.Auth) as any,
      controller.logs.bind(controller) as any
    );

    this.Router.route(`/${collection}/:recordtype/:id/:mode`)
      .get(
        this.Auth.authenticate.bind(this.Auth) as any,
        this.Auth.authorization(3).bind(this.Auth) as any,
        controller.get.bind(controller) as any
      )
      .patch(
        this.Auth.authenticate.bind(this.Auth) as any,
        this.Auth.authorization(3).bind(this.Auth) as any,
        controller.update.bind(controller) as any
      )
      .post(
        this.Auth.authenticate.bind(this.Auth) as any,
        this.Auth.authorization(3).bind(this.Auth) as any,
        controller.save.bind(controller) as any
      )
      .delete(
        this.Auth.authenticate.bind(this.Auth) as any,
        this.Auth.authorization(3).bind(this.Auth) as any,
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
    this.Router.route("/auth/refresh").post(
      this.Auth.refreshToken.bind(this.Auth) as any
    );
    this.Router.route("/auth/user").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.getUser.bind(this.Auth) as any
    );
    this.Router.route("/auth/verify").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      this.Auth.accessGranted.bind(this.Auth) as any
    );
  }
  public routeFiles(controller) {
    // Files
    this.Router.route("/files/upload/:path*?").post(
      controller.upload.bind(controller) as any
    );
    this.Router.route("/files/:path*?").get(
      this.Auth.authenticate.bind(this.Auth) as any,
      controller.find.bind(controller) as any
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