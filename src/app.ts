import express from "express";
import http from "http";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import DB from "./config/database";
import i18n from "./config/i18n";
import RoutesCore from "./routes/core";
import RoutesMaintenance from "./routes/maintenance";
import RoutesPublic from "./routes/public";
import EmitEvents from "./services/emitEvents";
import { errorHandler } from "./middleware/error-handler";
import storage from "./middleware/storage";
import Cache from "./middleware/cache";
import path from "path";

// Custom ENVIRONMENT Veriables

let env = dotenv.config({
  path: path.resolve(`.env.${process.env.NODE_ENV}`)
});

export const cache = new Cache();

export class App3CERP {
  public server?: http.Server;
  public app: express.Application = express();
  public PORT: string | number = process.env.PORT || 8080;

  public db: DB = new DB();
  public routesCore: RoutesCore = new RoutesCore();
  public routesMaintenance: RoutesMaintenance = new RoutesMaintenance();
  public routesPublic: RoutesPublic = new RoutesPublic();
  public emitEvents: EmitEvents = new EmitEvents();
  public storage = new storage();

  constructor() {
    process.title = "3CERP";
    console.log("NODE_ENV", process.env.NODE_ENV);
    console.log("NODE_PORT", process.env.PORT);
    this.config();

    this.dbConnect();
    this.mountRoutes();
    this.storage.init();
  }
  private config(): void {
    this.app.use(compression()); // compress all responses
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    //this.app.use(helmet());
    // serving static files
   
    this.app.use("/public",express.static("public"));
    this.app.use('/hosting', express.static("hosting"));
    this.app.use(require("express-status-monitor")());
    this.app.use(i18n.init);
  }
  private mountRoutes(): void {
    this.routesCore.start(this.app);
    this.routesMaintenance.start(this.app, this);
    this.routesPublic.start(this.app);
    this.emitEvents.start(this.app);
    this.app.use(errorHandler);
  }

  private dbConnect(): void {
    this.db.connect();
  }
  public stopServer() {
    if (this.server) {
      console.log("The server will be shut down for maintenance");
      this.server.close((err: any) => {
        console.log("Process terminated");
        //process.exit(err ? 1 : 0);
      });
    } else console.log("The Application Server is not running");
  }
  public startServer() {
    this.server = this.app.listen(this.PORT, () => {
      console.log(`App running ${this.PORT}! (env: ${process.env.NODE_ENV} )`);
    });
  }
}

new App3CERP().startServer();
