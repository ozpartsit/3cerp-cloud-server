import { Request, Response, NextFunction, RequestHandler } from "express";

import path, {dirname} from "path";
import i18n from "../config/i18n";

import constants from "../constants/index.js";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default class controller {
    public async get(req: Request, res: Response, next: NextFunction) {

        // i18n
        i18n.configure({
            directory: path.resolve(__dirname, "../constants/locales")
        });
        try {
            let values = [];
            if (constants[req.params.recordtype]) values = constants[req.params.recordtype]
            let result = values.map((value: any) => {
                if (value._id) {
                    return { ...value, name: res.__(`${req.params.recordtype}.${value._id}`) }
                } else
                    return { _id: value, name: res.__(`${req.params.recordtype}.${value}`) }
            })
            const data = {
                docs: result,
                page: 1,
                totalDocs: result.length,
                limit: result.length,
                totalPages: 1
            }


            res.json({ status: "success", data: data });
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }
}
