import Report from "../models/reports/model";
import controller from "./controller";
import { Request, Response, NextFunction } from "express";
export default class ReportController extends controller {
    constructor() {
        super({ model: Report, submodels: {} });
    }
    public async results(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        const model = this.setModel(recordtype);

        let document = await model.loadDocument(id);
        if (!document) res.status(404).json({
            message: 'Report not found'
        })
        else {
            let results = await document.getResults();
            res.json(results);
        }

    }
}
