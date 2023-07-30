import Email from "../models/email.model";
import controller from "./genericController";
import { Request, Response, NextFunction } from "express";
import { Document, Model } from 'mongoose';
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import { execSync, exec } from "child_process";
import path from "path";
import fs from "fs";

// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }
export default class EmailControllerr<T extends IExtendedDocument> extends controller<T> {
    constructor(model: IModel<T>) {
        super(model);
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
                // DKIM

                exec(`devil mail dkim sign ${domain}`, (error, stdout, stderr) => {
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
                    // fill DKIM field
                    Email.findByIdAndUpdate(email._id, { $set: { dkim: stdout } }).then(res => console.log(stdout))
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

            } catch (error) {
                console.log(error)
            }

        }
    }
}
