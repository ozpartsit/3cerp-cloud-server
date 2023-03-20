//requiring path and fs modules
import path from "path";
import fs from "fs";
import mime from "mime-types";
import shop, { IShop } from "../models/shop.model";
import { getFileSize } from "../utilities/usefull";

export default class HostingStructure {
    //resolve hosting path of directory
    public hostingPath: string = path.resolve("hosting");

    constructor() {
        if (!fs.existsSync(this.hostingPath)) fs.mkdirSync(this.hostingPath);
    }
    public init() {
        console.log("Init Hosting", this.hostingPath);
        this.mapShops(this.hostingPath);
    }
    public makeDir(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }
    public delDir(path: string) {
        try {
            fs.rmdirSync(path, { recursive: true });
            console.log(`${path} is deleted!`);
        } catch (err) {
            console.error(`Error while deleting ${path}.`);
        }
    }
    private async mapShops(
        dirPath: string,
    ) {

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
        }
    }
}
