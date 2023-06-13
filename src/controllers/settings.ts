import Table from "../models/preferences/table.model"
import Dashboard from "../models/preferences/dashboard.model"
import { Request, Response, NextFunction, query } from "express";

export default class SettingController {
    private models: any = {
        table: Table,
        dashboard: Dashboard
    };
    public async add(req: Request, res: Response, next: NextFunction) {
        const model = this.models[req.params.recordtype];
        try {
            let document = new model(req.body);
            document.save();
            res.json(document);
        } catch (error) {
            return next(error);
        }
    }
    public async update(req: Request, res: Response, next: NextFunction) {
        const model = this.models[req.params.recordtype];
        try {
            //let document = new model(req.body);
            // to do - update
            let document = await model.findOne({ _id: req.params.id });
            if (document) {
                document = await document.updateOne(req.body);
            }
            res.json(document);
        } catch (error) {
            return next(error);
        }
    }
    public async find(req: Request, res: Response, next: NextFunction) {
        const model = this.models[req.params.recordtype];
        try {
            // to to - zwraca tablice a powinno jeden element
            let query = req.query;
            let table: any = query.table;
            let defaultSetting = defaultSettings[table]
            let document = await model.find(query);
            if (document.length)
                res.json(document);
            else
                res.json([defaultSetting]);

        } catch (error) {
            return next(error);
        }
    }
}

// to do - przenieść do odzielnego pliku
const defaultSettings = {
    "salesorder.pendingapproval": { headers: ["name", "date", "entity", "amount"] },
    "salesorder.open": { headers: ["name", "date", "entity", "amount"] }
}