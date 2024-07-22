
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";

// External Services
import ChartDataController from "../controllers/chartdata.js";

export default class Routes {
    public RouterChartData: express.Router = express.Router();
    public Auth: Auth = new Auth();
    public ChartDataController = new ChartDataController();

    public start(app: express.Application): void {
        console.log("Start Chart Data Service Routing");

        this.routerWidget();
        app.use("/api/core/chartdata", this.RouterChartData);

    }

    public routerWidget() {
        // Widget
        this.RouterChartData.route("/:id").get(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.ChartDataController.getData.bind(this.ChartDataController) as any
        );

    }

}

