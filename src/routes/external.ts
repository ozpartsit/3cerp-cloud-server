
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";

// External Services
import DPDController from "../controllers/external/dpd";
import UPSController from "../controllers/external/ups";
export default class Routes {
    public RouterDPD: express.Router = express.Router();
    public RouterUPS: express.Router = express.Router();
    public Auth: Auth = new Auth();
    public dpdController = new DPDController();
    public upsController = new UPSController();

    public start(app: express.Application): void {
        console.log("Start External Service Routing");

        this.routerDPD();
        app.use("/api/dpd", this.RouterDPD);

        this.routerUPS();
        app.use("/api/ups", this.RouterUPS);
    }

    public routerDPD() {
        // DPD
        this.RouterDPD.route("/shipment/:param?").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.dpdController.shipment.bind(this.dpdController) as any
        );
        this.RouterDPD.route("/tracking/:param?").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.dpdController.tracking.bind(this.dpdController) as any
        );
    }
    public routerUPS() {
        // UPS
        this.RouterUPS.route("/token").get(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.upsController.getToken.bind(this.upsController) as any
        );
    }
}

