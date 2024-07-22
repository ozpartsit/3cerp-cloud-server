
import subdomain from "../middleware/subdomain";
import express, { Request, Response, NextFunction } from "express";

import HostingController from "../controllers/hosting";

export default class Routes {

    public RouterHosting: express.Router = express.Router();
    public hostingController: HostingController = new HostingController();

    public start(app: express.Application): void {
        console.log("Start Hosting Routing");

        app.use(subdomain("*", this.RouterHosting));

        this.routeHosting();


    }


    public routeHosting() {
        // Hosting
        this.RouterHosting.route("/sitemaps.xml").get(
            this.hostingController.sitemaps as any
        );
        this.RouterHosting.route("/sitemap.xml").get(
            this.hostingController.sitemap as any
        );
        this.RouterHosting.route("/:view/sitemap.xml").get(
            this.hostingController.sitemap as any
        );

        this.RouterHosting.route("/").get(
            this.hostingController.get.bind(this.hostingController) as any as any
        );
        this.RouterHosting.route("/language/:language").get(
            this.hostingController.setLanguage.bind(this.hostingController) as any as any
        );



        this.RouterHosting.route("/view/:param?").get(
            this.hostingController.get.bind(this.hostingController) as any as any
        );
        this.RouterHosting.route("/view/:urlComponent").get(
            this.hostingController.get.bind(this.hostingController) as any as any
        );
        this.RouterHosting.route("/account").get(
            this.hostingController.get.bind(this.hostingController) as any as any
        );
        this.RouterHosting.route("/:view?/:param?").get(
            this.hostingController.get.bind(this.hostingController) as any as any
        );
        // this.RouterHosting.route("*").get(
        //     this.hostingController.get as any
        // );
    }

}

