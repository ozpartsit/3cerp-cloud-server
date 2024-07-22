import shop, { IShop } from "../models/ecommerce/shop.model";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
export default function subdomain(subdomain: string, fn: any) {
    if (!subdomain || typeof subdomain !== "string") {
        throw new Error("The first parameter must be a string representing the subdomain");
    }

    //check fn handles three params..
    if (!fn || typeof fn !== "function" || fn.length < 3) {
        throw new Error("The second parameter must be a function that handles fn(req, res, next) params.");
    }
    return async function (req: any, res: any, next: NextFunction) {
        // domain pointer redirect to hosting
        let website = await shop.findOne({ domain: req.hostname });
        if (website) {
            console.log(website.languages)
            req.body.pointer = website.subdomain;
        }

        req._subdomainLevel = req._subdomainLevel || 0;

        var subdomainSplit = subdomain.split('.');
        var len = subdomainSplit.length;
        var match = true;

        //url - v2.api.example.dom
        //subdomains == ['api', 'v2']
        //subdomainSplit = ['v2', 'api']
        for (var i = 0; i < len; i++) {
            var expected = subdomainSplit[len - (i + 1)];
            var actual = req.subdomains[i + req._subdomainLevel];
            if (actual === "www") actual = false;
            if (expected === '*') { continue; }

            if (actual !== expected) {
                match = false;
                break;
            }
        }
        if ((actual || req.body.pointer) && match) {
            let website = await shop.findOne({ subdomain: actual });
            if (website) {
                let hostingPath = path.resolve("hosting");
                // Static files/assets
                let tmp = req.url.toString().split("/")
                let filePath = path.resolve(hostingPath, req.body.pointer || req.subdomains[0], ...tmp);
                // if does not exist on main dir check templates folder
                if (shop && !fs.existsSync(filePath)) filePath = path.resolve("templates", website.template, ...tmp);
                if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {

                    return res.sendFile(filePath);
                }
                //  else {
                //     let language = req.path.split("/")[1];
                //     const view = req.path.split("/")[2];

                //     if ((view && !language) || (language && !website.languages.includes(language))) {
                //         const referer = req.get('Referer') || req.get('Referrer');
                //         if (referer) {
                //             const refererUrl = new URL(referer);
                //             const refererPath = refererUrl.pathname;
                //             const refererLanguage = refererPath.split("/")[1];
                //             language = refererLanguage
                //         }
                //         if (!website.languages.includes(language)){
                //             language = website.languages[0]
                //         }
                //         // Przekierowanie do ścieżki z domyślnym językiem "en"
                //         return res.redirect(`/${language}${req.path}`);

                //     } else {
                //         // next();
                //     }
                // }



            }



            req._subdomainLevel++;//enables chaining
            return fn(req, res, next);
        } else {
            if (actual) res.send("ok")
            else next();
        }

    };
}