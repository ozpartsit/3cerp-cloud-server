import express, { Request, Response, NextFunction } from "express";
import { App3CERP } from "../app";
import path from "path";
import { execSync, exec } from "child_process";

export default class Routes {
  public Router: express.Router = express.Router();

  public start(app: express.Application, App3CERP: App3CERP): void {
    console.log("Start Maintenance Routing");
    this.stop(App3CERP);
    this.restart(App3CERP);
    app.use("/maintenance", this.Router);

    // exec("devil dns add 3c-erp.eu", (error, stdout, stderr) => {
    //   if (error) {
    //     console.log(`error: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     console.log(`stderr: ${stderr}`);
    //     return;
    //   }
    //   console.log(`stdout: ${stdout}`);

    // })
    // exec("devil www add 3c-erp.eu pointer 3cerp.cloud", (error, stdout, stderr) => {
    //   if (error) {
    //     console.log(`error: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     console.log(`stderr: ${stderr}`);
    //     return;
    //   }
    //   console.log(`stdout: ${stdout}`);

    // })
    //devil ssl www add 128.204.218.180 le le website.3cerp.cloud


  }

  public stop(App3CERP: App3CERP) {
    this.Router.route("/stop").get(() => {
      console.log("stop");
      App3CERP.stopServer();
    });
  }
  public restart(App3CERP: App3CERP) {
    this.Router.route("/restart/:domain").get((req) => {
      console.log("restart", req.params.domain);
      if (req.params.domain) {
        var packagePath = path.resolve();
        console.log(packagePath);
        App3CERP.stopServer();
        // Restart process ...
        setTimeout(() => {
          //execSync("npm run start", { stdio: "inherit", cwd: packagePath });
          execSync(`devil www restart ${req.params.domain}`, { stdio: "inherit", cwd: packagePath });
        }, 5000);
      }
    });
  }
}
