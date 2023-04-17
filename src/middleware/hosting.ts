//requiring path and fs modules
import path from "path";
import fs from "fs";
import { execSync, exec } from "child_process";
import shop, { IShop } from "../models/shop.model";
import express from "express";
export default class HostingStructure {
    //resolve hosting path of directory
    public hostingPath: string = path.resolve("hosting");

    constructor() {
        if (!fs.existsSync(this.hostingPath)) fs.mkdirSync(this.hostingPath);
    }
    public init() {
        console.log("Init Hosting", this.hostingPath);
        //this.mapShops();
    }

    public async mapShops(req: express.Request, res: Response, next: express.NextFunction) {
        console.log('mapShops')
        let shops = await shop.find();
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
                // Test email alias
                let adres_docelowy = 'notification@3cerp.cloud';
                let adres_zrodlowy = 'alias@ozparts.pl';
                exec(`devil mail alias add ${adres_docelowy} ${adres_zrodlowy}`, (error, stdout, stderr) => {
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


                // add custom domain
                if(site.domain)
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
                if(site.domain)
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
                if(site.subdomain)
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
                if(site.domain)
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
        next();
    }
}
