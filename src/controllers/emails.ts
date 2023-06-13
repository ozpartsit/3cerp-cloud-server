import Email from "../models/email.model";
import controller from "./controller";
import { Request, Response, NextFunction } from "express";
import { execSync, exec } from "child_process";
import path from "path";
import fs from "fs";
export default class EmailController extends controller {
    constructor() {
        super({ model: Email, submodels: {} });
    }
    public async save(req: Request, res: Response, next: NextFunction) {
        super.save(req, res, next);
        this.syncEmails();
    }
    public async syncEmails() {
        console.log('mapEmails')
        let emails = await Email.find();
        for (let email of emails) {

            try {
                // Test email alias

                let adres_docelowy = 'notification@3cerp.cloud';
                let adres_zrodlowy = email.name;
                let domain = adres_zrodlowy.split("@")[1];
                exec(`devil mail alias add ${adres_zrodlowy} ${adres_docelowy}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                })
                exec(`devil mail list`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                })
                exec(`devil mail list ${domain}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                })
                // DKIM


                // Domena dodana
                exec(`devil mail dkim dns ${domain}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                })
                // Domena zewnętrzna
                exec(`devil mail dkim dns ${domain} --print`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    // fill DKIM field
                    Email.findByIdAndUpdate(email._id, { dkim: stdout })
                })

            } catch (error) {
                console.log(error)
            }

        }
    }
}
