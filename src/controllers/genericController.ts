import { Request, Response, NextFunction } from 'express';
import { Document, Model, Types } from 'mongoose';
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import Email from "../services/email";
import Changelog from "../models/changelog.model";

// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }

// Uniwersalny kontroler generyczny
class GenericController<T extends IExtendedDocument> {
    public model: IModel<T>;

    constructor(model: IModel<T>) {
        this.model = model;
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        let { mode } = req.params;
        try {
            //req.body.ownerAccount = req.headers.owneraccount; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
            let { document, msg, saved } = await this.model.addDocument(mode, req.body);
            //populate response document
            await document.autoPopulate();
            document = document.constantTranslate(req.locale);
            res.json({ document, msg, saved });
        } catch (error) {
            return next(error);
        }
    }


    async get(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode } = req.params;
        try {
            let document = await this.model.getDocument(id, mode);

            if (!document) res.status(404).json(
                {
                    error: {
                        code: "doc_not_found",
                        message: req.__('doc_not_found')
                    }
                }
            )
            else {
                //populate response document
                await document.autoPopulate();
                let docObject = document.constantTranslate(req.locale);
                res.json({ document: docObject, mode: mode === "advanced" ? mode : "simple" });
            }
        } catch (error) {
            return next(error);
        }
    }

    public async save(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        try {
            let { document_id, saved } = await this.model.saveDocument(id);
            if (!document_id) {
                res.status(404).json(
                    {
                        error: {
                            code: "doc_not_found",
                            message: req.__('doc_not_found')
                        }
                    }
                )
            } else {
                res.json({ document_id, saved });
            }

        } catch (error) {
            return next(error);
        }
    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { recordtype, mode, id } = req.params;
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
            let { document, msg, saved } = await this.model.updateDocument(id, mode, update);

            if (!document) {
                res.status(404).json(
                    {
                        error: {
                            code: "doc_not_found",
                            message: req.__('doc_not_found')
                        }
                    }
                )
            } else {
                //populate response document
                await document.autoPopulate();
                document = document.constantTranslate(req.locale);
                res.json({ document, msg, saved });
            }

        } catch (error) {
            return next(error);
        }
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        try {// to do - do poprawy
            let document = this.model.deleteDocument(id);
            res.json(document);
        } catch (error) {
            return next(error);
        }
    }
    public async send(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
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
        try {
            let fields = await this.model.getFields(req.locale)
            res.json(fields);
        } catch (error) {
            return next(error);
        }
    }
    public async form(req: Request, res: Response, next: NextFunction) {
        let { recordtype } = req.params;
        try {
            let form = await this.model.getForm(req.locale);
            if (form) {
                let fields = await this.model.getFields(req.locale);
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

    public async find(req: Request, res: Response, next: NextFunction) {

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
                this.model.getFields(req.locale).forEach(field => {
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

            let result = await this.model.findDocuments(query, options);
            let total = await this.model.count(query);
            // get fields
            let fields = this.model.getFields(req.locale).filter((field: any) => options.select[field.field])
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
}

export default GenericController;