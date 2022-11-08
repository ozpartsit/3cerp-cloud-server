import express, { Request, Response, NextFunction } from "express";
import { App3CERP } from "../app";
import path from "path";
import { execSync, spawn } from "child_process";

export default class Routes {
  public Router: express.Router = express.Router();

  public start(app: express.Application, App3CERP: App3CERP): void {
    console.log("Start Maintenance Routing");
    this.stop(App3CERP);
    this.restart(App3CERP);
    app.use("/maintenance", this.Router);
  }

  public stop(App3CERP: App3CERP) {
    this.Router.route("/stop").get(() => {
      console.log("stop");
      App3CERP.stopServer();
    });
  }
  public restart(App3CERP: App3CERP) {
    this.Router.route("/restart").get(() => {
      console.log("restart");
      var packagePath = path.resolve();
      console.log(packagePath);
      App3CERP.stopServer();
      // Restart process ...
      setTimeout(() => {
        execSync("npm run start", { stdio: "inherit", cwd: packagePath });
      }, 5000);
    });
  }
}
