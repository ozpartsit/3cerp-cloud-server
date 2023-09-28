
import subdomain from "../middleware/subdomain";
import express, { Request, Response, NextFunction } from "express";

import HostingController from "../controllers/hosting";

export default class Routes {

    public RouterHosting: express.Router = express.Router();
    public hostingController: HostingController = new HostingController();

    public start(app: express.Application): void {
        console.log("Start Hosting Routing");

        this.routeHosting();
        app.use(subdomain("*", this.RouterHosting));
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

