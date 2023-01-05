import { Request, Response, NextFunction, RequestHandler } from "express";

import path from "path";
import i18n from "../config/i18n";

import { getCountries } from "../constants/countries";
import { getStates } from "../constants/states";
import { getCurrencies } from "../constants/currencies";
import { getPriceBasis } from "../constants/price.basis";
const constants = { countries: getCountries, states: getStates, currencies: getCurrencies, pricebasis: getPriceBasis };
export default class controller {
    public async get(req: Request, res: Response, next: NextFunction) {

        // i18n
        i18n.configure({
            directory: path.resolve(__dirname, "../constants/locales")
        });

        try {
            const values = await constants[req.params.recordtype](req.query);
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
