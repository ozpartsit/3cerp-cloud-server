import { Request, Response, NextFunction, RequestHandler } from "express";

import path from "path";
import i18n from "../config/i18n";

import countries from "../constants/countries";

const constants = { countries };
export default class controller {
    public async get(req: Request, res: Response, next: NextFunction) {

        // i18n
        i18n.configure({
            directory: path.resolve(__dirname, "../constants/locales")
        });

        try {
            const values = constants[req.params.recordtype];
            let result = values.map(value => {
                return { _id: value, name: res.__(value) }
            })
            res.json(result);
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }
}
