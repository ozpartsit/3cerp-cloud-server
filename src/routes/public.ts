import express, { Request, Response, NextFunction } from "express";
import path from "path";

export default class Routes {
    public Router: express.Router = express.Router();

    public start(app: express.Application): void {
        console.log("Start Public Routing");
        let publicePath = path.resolve("public");

        this.Router.route("/*").get((req: Request, res: Response) => {
            console.log("client.html")
            res.sendFile(path.resolve(publicePath, 'client.html'));
        })
        app.use("/*", this.Router);
    }

}
