import express from "express";
import fileUpload from "express-fileupload";
import http from "http";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import DB from "./config/database";
import i18n from "./config/i18n";
import StatusMonitor from "./config/statusMonitor";
// Routing
import RoutesCore from "./routes/core";
import RoutesUI from "./routes/ui";
import RoutesAuth from "./routes/auth";
import RoutesHosting from "./routes/hosting";
import RoutesMaintenance from "./routes/maintenance";
import RoutesExternal from "./routes/external";
import RoutesPublic from "./routes/public";
import EmitEvents from "./services/emitEvents";
import EmailServer from "./services/email";
import { errorHandler } from "./middleware/error-handler";
import storage from "./config/storage";
//import Cache from "./middleware/cache";
import Limiter from "./middleware/limiter";
import path from "path";

// Custom ENVIRONMENT Veriables

let env = dotenv.config({
  path: path.resolve(`.env.${process.env.NODE_ENV}`)
});

//export const cache = new Cache();
export class App3CERP {
  public server?: http.Server;
  public app: express.Application = express();
  public PORT: string | number = process.env.PORT || 8080;

  public db: DB = new DB();
  // Routing
  public routesCore: RoutesCore = new RoutesCore();
  public routesUI: RoutesUI = new RoutesUI();
  public routesAuth: RoutesAuth = new RoutesAuth();
  public routesHosting: RoutesHosting = new RoutesHosting();
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
    EmailServer.verify();
    //this.hosting.init();
  }
  private config(): void {
    this.app.use(compression()); // compress all responses
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    // enable files upload
    this.app.use(fileUpload({
      createParentPath: true
    }));
    //this.app.use(helmet());
    // serving static files
    this.app.use('/storage', express.static("storage")); // Storage files
    this.app.use("/public", express.static("public"));
    this.app.use('/hosting', express.static("hosting"));

    //temporary public local files
    this.app.use('/locales', express.static(path.join(__dirname, 'constants', 'locales')));
    // Apply the rate limiting middleware to API calls only
    this.app.use('/api', Limiter)

    this.app.use(StatusMonitor);
    this.app.use(i18n.init);
  }
  private mountRoutes(): void {
    // Routing
    this.routesCore.start(this.app);
    this.routesUI.start(this.app);
    this.routesAuth.start(this.app);
    this.routesHosting.start(this.app);
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
