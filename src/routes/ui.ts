
import Auth from "../middleware/auth";
import subdomain from "../middleware/subdomain";
import express, { Request, Response, NextFunction } from "express";
import NotificationController from "../controllers/ui/notifications";
import SearchController from "../controllers/ui/search";

export default class Routes {
    public Router: express.Router = express.Router();
    public Auth: Auth = new Auth();
    public notificationController = new NotificationController();
    public searchController = new SearchController();

    public start(app: express.Application): void {
        console.log("Start Routing UI Services");

        this.routerNotifications();
        this.routerSearch();
        app.use("/api/core/ui", this.Router);
    }


    public routerNotifications() {
        // get
        this.Router.route("/notifications/view/:id").get(
            this.Auth.authenticate.bind(this.Auth) as any,
            this.notificationController.get.bind(this.notificationController) as any
        );
        // check
        this.Router.route("/notifications/check").get(
            this.Auth.authenticate.bind(this.Auth) as any,
            this.notificationController.check.bind(this.notificationController) as any
        );
        // Find
        this.Router.route("/notifications/:status").get(
            this.Auth.authenticate.bind(this.Auth) as any,
            this.notificationController.find.bind(this.notificationController) as any
        );
        // Archive
        this.Router.route("/notifications/archive/:id").patch(
            this.Auth.authenticate.bind(this.Auth) as any,
            this.notificationController.archive.bind(this.notificationController) as any
        );
        // delete
        this.Router.route("/notifications/delete/:id").delete(
            this.Auth.authenticate.bind(this.Auth) as any,
            this.notificationController.archive.bind(this.notificationController) as any
        );
    }


    public routerSearch() {
        // get
        this.Router.route("/search/").get(
            this.Auth.authenticate.bind(this.Auth) as any,
            this.searchController.find.bind(this.searchController) as any
        );
    }

}

