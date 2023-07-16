import { Request, Response, NextFunction } from "express";
import mongoose, { models } from "mongoose";
import Email from "../services/email";
import Changelog from "../models/changelog.model";
import i18n from "../config/i18n";
export default class controller {
    private models: any = {};
    constructor(models: any) {
        this.models = models;
    }
    public setModel(recordtype: string, db?: string) {
        if (this.models) {
            let Model = (this.models.submodels[recordtype] || this.models.model);
            //Model.getFields();
            // Create or assign models from dedicate BD - to do
            if (db) {
                const connection = mongoose.connections.find(conn => conn.name === db);
                if (connection) {
                    if (!connection.models[Model.modelName]) Model = connection.model(Model.modelName, Model.schema) //- działa
                    else Model = connection.models[Model.modelName];
                }
            }

            return Model;
        } else throw 'błąd';
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        // init Model and create new Document

        const model = this.setModel(req.params.recordtype);
        try {
            //req.body.ownerAccount = req.headers.owneraccount; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
            let { document, msg } = await model.addDocument(req.body);
            //populate response document
            await document.autoPopulate();
            document = document.constantTranslate(req.locale);
            res.json({ document, msg });
        } catch (error) {
            return next(error);
        }
    }

    public async find(req: Request, res: Response, next: NextFunction) {
        const model = this.setModel(req.params.recordtype);

        try {
            let query: any = {};

            let options = { select: { name: 1, type: 1, resource: 1, link: 1 }, sort: {}, limit: 50, skip: 0 };
            let filters = (req.query.filters || "").toString();
            if (filters) {
                query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
            }
            //query.ownerAccount = req.headers.owneraccount; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
            let select = (req.query.select || req.query.fields || "").toString();
            if (select) {
                options.select = select.split(",").reduce((o, f) => { o[f] = 1; return o; }, { name: 1, type: 1, resource: 1, link: 1 });
            } else {
                // add default field to select
                model.getFields(req.locale).forEach(field => {
                    if (field.select) options.select[field.field] = 1;
                })
            }
            // Sort
            let sort = (req.query.sort || "").toString();
            if (sort) {
                options.sort = sort.split(",").reduce((o, f) => {
                    // -date = desc sort per date field
                    if (f[0] == "-") {
                        f = f.substring(1);
                        o[f] = 1;
                    } else {
                        o[f] = 1;
                    }
                    return o;
                }, {});
            }
            // search by keyword
            let search = (req.query.search || "").toString();
            if (search) {
                query['name'] = { $regex: `,*${req.query.search}.*` }
            }

            // loop per query params
            for (const [key, value] of Object.entries(req.query)) {
                if (["filters", "select", "fields", "search", "sort", "page", "limit"].includes(key))
                    query[key] = { $eq: value }
                // add verify field exists
            }


            options.limit = parseInt((req.query.limit || 50).toString());
            options.skip = parseInt((req.query.skip || ((Number(req.query.page || 1) - 1) * options.limit) || 0).toString());

            let result = await model.findDocuments(query, options);
            let total = await model.count(query);
            // get fields
            let fields = model.getFields(req.locale).filter((field: any) => options.select[field.field])
            for (let index in result) {
                result[index] = await result[index].constantTranslate(req.locale);

            }
            //to do - test przypisania do source.field

            // result = result.map(line => {
            //     let row = {};
            //     for (const [key, value] of Object.entries(options.select)) {
            //         console.log(key, value,line[key])
            //         row[key] = line[key];
            //     }
            //     return row;
            // })
            // console.log(result)

            const data = {
                fields: fields,
                docs: result,
                totalDocs: total,
                limit: options.limit,
                page: options.skip,
                totalPages: Math.ceil(total / options.limit)
            }

            res.json(data);
        } catch (error) {
            return next(error);
        }
    }

    public async get(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode } = req.params;
        const model = this.setModel(recordtype);
        try {
            let document = await model.getDocument(id, mode);
            if (!document) res.status(404).json({
                message: req.__('doc_not_found')
            })
            else {
                //populate response document
                await document.autoPopulate();
                document = document.constantTranslate(req.locale);
                res.json(document);
            }
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
            // let document = null;
            // if (Array.isArray(req.body)) { // to do - może upateDocument zmienić by przyjomwał cały obiek body?
            //     for (let update of req.body) {
            //         let { list, subrecord, field, value, save } = update;
            //         document = await model.updateDocument(id, update);
            //     }
            // } else {
            //     let { list, subrecord, field, value, save } = req.body;
            //     document = await model.updateDocument(id, list, subrecord, field, value, save);
            // }
            let update = req.body;
            let { document, msg } = await model.updateDocument(id, update);
            //populate response document
            await document.autoPopulate();
            document = document.constantTranslate(req.locale);
            res.json({ document, msg });
        } catch (error) {
            return next(error);
        }
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        const model = this.setModel(recordtype);
        try {// to do - do poprawy
            let document = model.deleteDocument(id)
            res.json(document);
        } catch (error) {
            return next(error);
        }
    }
    public async send(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        const model = this.setModel(recordtype);
        let config = req.body;
        try {
            let email: Email = new Email();
            let status = await email.send(config);
            res.json(status);
        } catch (error) {
            return next(error);
        }
    }
    public async fields(req: Request, res: Response, next: NextFunction) {
        let { recordtype } = req.params;
        const model = this.setModel(recordtype);
        try {
            let fields = await model.getFields(req.locale)
            res.json(fields);
        } catch (error) {
            return next(error);
        }
    }
    public async form(req: Request, res: Response, next: NextFunction) {
        let { recordtype } = req.params;
        const model = this.setModel(recordtype);
        try {
            let form = await model.getForm(req.locale);
            if (form) {
                let fields = await model.getFields(req.locale);
                form.sections.forEach((section: any) => {
                    if (section.table) {
                        section.table = fields.find((f: any) => f.field == section.table) || null;
                    }
                    section.cols.forEach((col: any) => {

                        if (col.rows) col.rows.forEach((row: any) => {
                            if (row) row.forEach((field: any, index: any) => {
                                row[index] = fields.find((f: any) => f.field == field) || null;
                                if (row[index]) {
                                    if (row[index].type != "EmbeddedField") delete row[index].fields;
                                    delete row[index].selects;
                                    delete row[index].ref;
                                }
                            })
                        })
                    })
                })
            }


            res.json(form);
        } catch (error) {
            return next(error);
        }
    }
    public async logs(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        const model = this.setModel(recordtype);
        try {
            let query: any = { document: id };
            let results = await Changelog.find(query)
                .populate({ path: 'newValue', select: 'name' })
                .populate({ path: 'oldValue', select: 'name' })
                .exec();
            // parse to plain result
            let changelogs = results.map((line: any) => {
                return {
                    newValue: line.newValue && line.newValue.name ? line.newValue.name : line.newValue,
                    oldValue: line.oldValue && line.oldValue.name ? line.oldValue.name : line.oldValue,
                    date: new Date(line.createdAt).toISOString().substr(0, 10),
                    field: line.field,
                    list: line.list
                }
            })
            res.json(changelogs);
        } catch (error) {
            return next(error);
        }
    }
    // public async options(req: Request, res: Response, next: NextFunction) {
    //     let { recordtype, id, mode } = req.params;
    //     const model = this.setModel(recordtype);
    //     try {
    //         let document = await model.getDocument(id, mode);
    //         if (!document) res.status(404).json({
    //             message: 'Document not found'
    //         })
    //         else{

    //         }
    //     } catch (error) {
    //         return next(error);
    //     }
    // }
}