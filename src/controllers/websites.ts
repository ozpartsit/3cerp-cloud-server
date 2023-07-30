import Website from "../models/shop.model";
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

export default class WebsiteController<T extends IExtendedDocument> extends controller<T> {
    constructor(model: IModel<T>) {
        super(model);
    }
    public async save(req: Request, res: Response, next: NextFunction) {
        super.save(req, res, next);
        this.syncSites();
    }
    public async syncSites() {
        let shops = await Website.find();
        for (let site of shops) {
            let sitePath = path.resolve("hosting", site.subdomain);
            let siteTemplatesPath = path.resolve("hosting", site.subdomain, "templates");
            //let siteTemplatePath = path.resolve("hosting", site.subdomain, "templates", site.template);
            if (!fs.existsSync(sitePath)) fs.mkdirSync(sitePath);
            if (!fs.existsSync(siteTemplatesPath)) fs.mkdirSync(siteTemplatesPath);
            // if (!fs.existsSync(siteTemplatePath)) {
            //     fs.mkdirSync(siteTemplatePath);
            //     // copy template source if was modified
            //     //fs.cp()
            // }
            try {

                // add custom domain
                if (site.domain)
                    exec(`devil dns add ${site.domain}`, (error, stdout, stderr) => {
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
                // add pointer
                if (site.domain)
                    exec(`devil www add ${site.domain} pointer 3cerp.cloud`, (error, stdout, stderr) => {
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
                //add SSL
                if (site.subdomain)
                    exec(`devil ssl www add 128.204.218.180 le le ${site.subdomain}.3cerp.cloud`, (error, stdout, stderr) => {
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
                if (site.domain)
                    exec(`devil ssl www add 128.204.218.180 le le ${site.domain}`, (error, stdout, stderr) => {
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
