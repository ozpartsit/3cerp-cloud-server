/**
 * @file Główny plik aplikacji serwera 3CERP.
 * Inicjalizuje serwer Express, konfiguruje middleware, łączy się z bazą danych,
 * montuje trasy i uruchamia serwer.
 */
import fs from "fs";
import gracefulFs from "graceful-fs";
gracefulFs.gracefulify(fs); // To "naprawia" fs globalnie

import express from "express";
import fileUpload from "express-fileupload";
import http from "http";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import DB from "./config/database";
import i18n from "./config/i18n";
import StatusMonitor from "./config/statusMonitor";
// Routing
import RoutesCore from "./routes/core";
import RoutesUI from "./routes/ui";
import RoutesAuth from "./routes/auth";
import RoutesWebsite from "./routes/website";
import RoutesHosting from "./routes/hosting";
import RoutesChartData from "./routes/chart-data";
import RoutesMaintenance from "./routes/maintenance";
import RoutesExternal from "./routes/external";
import RoutesPublic from "./routes/public";
import EmitEvents from "./services/emitEvents";
import EmailServer from "./services/email";
import errorHandler from "./middleware/error-handler";
import Storage from "./config/storage";
//import Cache from "./middleware/cache";
import Limiter from "./middleware/limiter";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';

// Użycie import.meta.url do uzyskania __filename i __dirname w modułach ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- Konfiguracja zmiennych środowiskowych ---
// Ładuje zmienne środowiskowe z pliku .env w zależności od środowiska (np. .env.development, .env.production)
// Zmienne te są dostępne w całej aplikacji poprzez `process.env`.
dotenv.config({
  path: path.resolve(`.env.${process.env.NODE_ENV}`)
});


//export const cache = new Cache();
/**
 * Główna klasa aplikacji, która zarządza serwerem Express.
 */
export class App3CERP {
  public server?: http.Server;
  public app: express.Application = express();
  public readonly PORT: string | number = process.env.PORT || 8080;

  public db: DB = new DB();
  // Routing
  public routesCore: RoutesCore = new RoutesCore();
  public routesUI: RoutesUI = new RoutesUI();
  public routesAuth: RoutesAuth = new RoutesAuth();
  public routesWebsite: RoutesWebsite = new RoutesWebsite();
  public routesHosting: RoutesHosting = new RoutesHosting();
  public routesChartData: RoutesChartData = new RoutesChartData();

  public routesMaintenance: RoutesMaintenance = new RoutesMaintenance();
  public routesExternal: RoutesExternal = new RoutesExternal();
  public routesPublic: RoutesPublic = new RoutesPublic();

  public readonly emitEvents: EmitEvents = new EmitEvents();

  public storage: Storage = new Storage();

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

  /**
   * Konfiguruje middleware aplikacji Express.
   */
  private config(): void {
    this.app.use(compression()); // compress all responses
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    // Użycie cookie-parser middleware
    this.app.use(cookieParser());
    // enable files upload
    this.app.use(fileUpload({
      createParentPath: true
    }));

    // Helmet pomaga zabezpieczyć aplikację, ustawiając różne nagłówki HTTP.
    // Zalecane jest włączenie go, zwłaszcza w środowisku produkcyjnym.
    this.app.use(helmet());
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

  /**
   * Montuje wszystkie trasy (endpoints) aplikacji.
   */
  private mountRoutes(): void {
    // Routing
    this.routesCore.start(this.app);
    this.routesUI.start(this.app);
    this.routesAuth.start(this.app);
    this.routesWebsite.start(this.app);
    this.routesHosting.start(this.app);
    this.routesChartData.start(this.app);
    this.routesMaintenance.start(this.app, this);
    this.routesExternal.start(this.app);
    this.routesPublic.start(this.app);

    this.emitEvents.start(this.app);
    this.app.use(errorHandler);
  }

  /**
   * Inicjalizuje połączenie z bazą danych.
   */
  private dbConnect(): void {
    this.db.connect();
  }

  /**
   * Zatrzymuje serwer w sposób kontrolowany (graceful shutdown).
   * Jest to przydatne podczas prac konserwacyjnych lub deploymentu.
   */
  public stopServer() {
    if (this.server) {
      console.log("The server will be shut down for maintenance");
      this.server.close((err: any) => {
        console.log("Process terminated");
        // Zakończenie procesu jest ważne, aby zwolnić zasoby i umożliwić
        // np. menedżerowi procesów (jak PM2) lub Dockerowi ponowne uruchomienie.
        process.exit(err ? 1 : 0);
      });
    } else console.log("The Application Server is not running");
  }

  /**
   * Uruchamia serwer aplikacji na skonfigurowanym porcie.
   */
  public startServer() {
    this.server = this.app.listen(this.PORT, () => {
      console.log(`App running ${this.PORT}! (env: ${process.env.NODE_ENV} )`);
    });
  }
}

new App3CERP().startServer();
