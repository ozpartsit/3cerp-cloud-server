import express, { Request, Response, NextFunction } from "express";
import path from "path";

export default class Routes {
    public Router: express.Router = express.Router();

    public start(app: express.Application): void {
        console.log("Start Public Routing");
        let publicePath = path.resolve("public");
        this.Router.route("*").get((req: Request, res: Response) => {
            res.sendFile(path.resolve(publicePath, 'index.html'));
        })
        app.use("/", this.Router);
    }

}
