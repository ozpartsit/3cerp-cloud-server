
import subdomain from "../middleware/subdomain";
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";

// Webiste Services
import WebsiteController from "../controllers/internal/website.js";
import ShoppingCartController from "../controllers/internal/shoppingCart.js";
import AccountController from "../controllers/internal/account.js"

import SalesOrder from "../models/transactions/salesOrder/schema.js";
import Website from "../models/ecommerce/shop.model.js";
import Customer from "../models/entities/customer/schema.js";
export default class Routes {
    public RouterWebsite: express.Router = express.Router();
    public Auth: Auth = new Auth();
    public cartController = new ShoppingCartController(SalesOrder);
    public siteController = new WebsiteController(Website);
    public accountController = new AccountController(Customer);

    public start(app: express.Application): void {
        console.log("Start API Webiste Routing");

        app.use("/api", subdomain("*", this.RouterWebsite));

        this.routerWebsite();


    }

    public routerWebsite() {
        // Webiste
        this.RouterWebsite.route("/cart/:id?").get(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.cartController.getShoppingCart.bind(this.cartController) as any
        );
        this.RouterWebsite.route("/cart/add/:id?").put(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.cartController.addToShoppingCart.bind(this.cartController) as any
        );
        this.RouterWebsite.route("/cart/options/:id?").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.cartController.shoppingCartOptions.bind(this.cartController) as any
        );
        this.RouterWebsite.route("/cart/update/:id?").patch(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.cartController.updateShoppingCart.bind(this.cartController) as any
        );
        this.RouterWebsite.route("/cart/confirm/:id?").put(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.cartController.shoppingCartConfirm.bind(this.cartController) as any
        );
        this.RouterWebsite.route("/cart/clear/:id?").put(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.cartController.shoppingCartClear.bind(this.cartController) as any
        );

        this.RouterWebsite.route("/account/:id?").get(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.accountController.getAccount.bind(this.accountController) as any
        );
        this.RouterWebsite.route("/account/update/:id?").patch(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.accountController.updateAccount.bind(this.accountController) as any
        );
        this.RouterWebsite.route("/account/options/:id?").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.accountController.accountOptions.bind(this.accountController) as any
        );

        this.RouterWebsite.route("/confs/:id?").get(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.siteController.confs.bind(this.siteController) as any
        );
        this.RouterWebsite.route("/login").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.siteController.login.bind(this.siteController) as any
        );
        this.RouterWebsite.route("/resetpassword").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.siteController.resetPassword.bind(this.siteController) as any
        );
        this.RouterWebsite.route("/resetpassword/:id").patch(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.siteController.updatePassword.bind(this.siteController) as any
        );
        this.RouterWebsite.route("/contact").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.siteController.contact.bind(this.siteController) as any
        );
        this.RouterWebsite.route("/register").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.siteController.register.bind(this.siteController) as any
        );
    }

}

