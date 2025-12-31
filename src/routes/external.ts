
import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";

// External Services
import DPDController from "../controllers/external/dpd";
import DPDUKController from "../controllers/external/dpduk";
import UPSController from "../controllers/external/ups";
import PGSController from "../controllers/external/pgs";
export default class Routes {
    public RouterDPD: express.Router = express.Router();
    public RouterDPDUK: express.Router = express.Router();
    public RouterUPS: express.Router = express.Router();
    public RouterPGS: express.Router = express.Router();
    public Auth: Auth = new Auth();
    public dpdController = new DPDController();
    public dpdUKController = new DPDUKController();
    public upsController = new UPSController();
    public pgsController = new PGSController();

    public start(app: express.Application): void {
        console.log("Start External Service Routing");

        this.routerDPD();
        app.use("/api/dpd", this.RouterDPD);

        this.routerDPDUK();
        app.use("/api/dpduk", this.RouterDPDUK);

        this.routerUPS();
        app.use("/api/ups", this.RouterUPS);

        this.routerPGS();
        app.use("/api/pgs", this.RouterPGS);
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
    public routerDPDUK() {
        // DPD
        this.RouterDPDUK.route("/shipment/:param?").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.dpdUKController.shipment.bind(this.dpdUKController) as any
        );
        this.RouterDPDUK.route("/label/:shipmentId").get(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.dpdUKController.label.bind(this.dpdUKController) as any
        );
    }
    public routerUPS() {
        // UPS
        this.RouterUPS.route("/token/:account?").get(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.upsController.getToken.bind(this.upsController) as any
        );
    }
    public routerPGS() {
        // DPD
        this.RouterPGS.route("/shipment/:param?").post(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.pgsController.shipment.bind(this.pgsController) as any
        );
        this.RouterPGS.route("/label/:shipmentId").get(
            //this.Auth.authenticate.bind(this.Auth) as any,
            this.pgsController.label.bind(this.pgsController) as any
        );
    }
}

