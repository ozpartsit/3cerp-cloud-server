
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";

export default class Routes {
    public Router: express.Router = express.Router();
    public Auth: Auth = new Auth();

    public start(app: express.Application): void {
        console.log("Start Auth Routing");
        //Auth
        this.routeAuth();
        app.use("/api/core", this.Router);
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



}

