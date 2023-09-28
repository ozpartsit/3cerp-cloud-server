
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";

// External Services
import DPDController from "../controllers/external/dpd";

export default class Routes {
    public RouterDPD: express.Router = express.Router();
    public Auth: Auth = new Auth();
    public dpdController = new DPDController();

    public start(app: express.Application): void {
        console.log("Start External Service Routing");

        this.routerDPD();
        app.use("/api/dpd", this.RouterDPD);
    }

    public routerDPD() {
        // DPD
        this.RouterDPD.route("/shipment/:param?").post(
            this.Auth.authenticate.bind(this.Auth) as any,
            this.dpdController.shipment.bind(this.dpdController) as any
        );
    }

}

