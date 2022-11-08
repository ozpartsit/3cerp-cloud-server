import { Request, Response, NextFunction } from "express";
export default class controller {
    private models: any = {};
    constructor(models: any) {
        this.models = models;
    }
    private setModel(recordtype: string) {
        if (this.models)
            return this.models.submodels[recordtype] || this.models.model;
        else throw 'błąd';
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        // init Model and create new Document
        const model = this.setModel(req.params.recordtype);
        try {
            let document = model.addDocument(req.body)
            res.json(document);
        } catch (error) {
            return next(error);
        }
    }

    public async find(req: Request, res: Response, next: NextFunction) {
        const model = this.setModel(req.params.recordtype);
        try {
            let query = {};
            let options = { select: { name: 1, type: 1, collection: 1, link: 1 }, sort: {}, limit: 50 };
            let filters = (req.query.filters || "").toString();
            if (filters) {
                query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
            }

            let select = (req.query.select || "").toString();
            if (select) {
                options.select = select.split(",").reduce((o, f) => { o[f] = 1; return o; }, { name: 1, type: 1, collection: 1, link: 1 });
            }
            let sort = (req.query.sort || "").toString();
            if (sort) {
                options.sort = sort.split(",").reduce((o, f) => {
                    // -date = desc sort per date field
                    if (f[0] == "-") {
                        f = f.substring(1);
                        o[f] = 1;
                    } else
                        o[f] = 1;
                    return o;
                }, {});
            }

            options.limit = parseInt((req.query.limit || 0).toString());
            let result = await model.findDocuments(query, options);
            for (let line of result) {
                await line.autoPopulate(req);
            }
            res.json(result);
        } catch (error) {
            return next(error);
        }
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode } = req.params;
        const model = this.setModel(recordtype);

        try {
            let document = await model.getDocument(id, mode);
            res.json(document);
        } catch (error) {
            return next(error);
        }
    }
    public async save(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        const model = this.setModel(recordtype);
        try {
            let document = await model.saveDocument(id);
            res.json(document);
        } catch (error) {
            return next(error);
        }
    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        const model = this.setModel(recordtype);
        try {
            let { list, subrecord, field, value } = req.body;
            let document = await model.updateDocument(id, list, subrecord, field, value);
            res.json(document);
        } catch (error) {
            return next(error);
        }
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        const model = this.setModel(recordtype);
        try {
            let document = model.deleteDocument(id)
            res.json(document);
        } catch (error) {
            return next(error);
        }
    }
}