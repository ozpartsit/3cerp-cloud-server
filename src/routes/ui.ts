
import Auth from "../middleware/auth";
import subdomain from "../middleware/subdomain";
import express, { Request, Response, NextFunction } from "express";
import Controller from "../controllers/genericController";
import NotificationController from "../controllers/ui/notifications";
import SearchController from "../controllers/ui/search";
import NotesController from "../controllers/ui/notes";
import { FavoritesTypes } from "../models/favorites/model";
import Note from "../models/note.model";
export default class Routes {
    public Router: express.Router = express.Router();
    public Auth: Auth = new Auth();
    public notificationController = new NotificationController();
    public searchController = new SearchController();
    public notesController = new NotesController(Note);
    //public favoritesController = new Controller(FavoritesTypes.category)

    public start(app: express.Application): void {
        console.log("Start Routing UI Services");

        this.routerNotifications();
        this.routerSearch();
        //this.routerFavorites();
        //favorites
        Object.values(FavoritesTypes).forEach(favorite => {
            this.routeUniversal(`favorites`, favorite.modelName, new Controller(favorite))
        })
        //Notes
        this.routeUniversal(`notes`, Note.modelName, new Controller(Note))

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
        this.Router.route("/search/scope/").get(
            this.Auth.authenticate.bind(this.Auth) as any,
            this.searchController.scope.bind(this.searchController) as any
        );
    }

    // public routerFavorites() {
    //     // get
    //     this.Router.route("/favorites").get(
    //         this.Auth.authenticate.bind(this.Auth) as any,
    //         this.favoritesController.find.bind(this.favoritesController) as any
    //     );
    //     // add
    //     this.Router.route("/favorites").post(
    //         this.Auth.authenticate.bind(this.Auth) as any,
    //         this.favoritesController.add.bind(this.favoritesController) as any
    //     );
    //     // update
    //     this.Router.route("/favorites").patch(
    //         this.Auth.authenticate.bind(this.Auth) as any,
    //         this.favoritesController.update.bind(this.favoritesController) as any
    //     );
    //     // del
    //     this.Router.route("/favorites").delete(
    //         this.Auth.authenticate.bind(this.Auth) as any,
    //         this.favoritesController.delete.bind(this.favoritesController) as any
    //     );
    // }

    public routeUniversal(collection: string, recordtype: string, controller: any) {
        let path = (`/${collection}/${recordtype}`).toLowerCase();

        this.Router.route(`${path}`).get(
            this.Auth.authenticate.bind(this.Auth) as any,
            controller.find.bind(controller) as any
        );
        this.Router.route(`${path}/new/:mode?`).post(
            this.Auth.authenticate.bind(this.Auth) as any,
            controller.add.bind(controller) as any
        );
        this.Router.route(`${path}/update`).patch(
            this.Auth.authenticate.bind(this.Auth) as any,
            controller.massUpdate.bind(controller) as any
        );
        this.Router.route(`${path}/:id/:mode?`)
            .get(
                this.Auth.authenticate.bind(this.Auth) as any,
                controller.get.bind(controller) as any
            )
            .patch(
                this.Auth.authenticate.bind(this.Auth) as any,
                controller.update.bind(controller) as any
            )
            .put(
                this.Auth.authenticate.bind(this.Auth) as any,
                controller.save.bind(controller) as any
            )
            .delete(
                this.Auth.authenticate.bind(this.Auth) as any,
                controller.delete.bind(controller) as any
            );
    }
}

