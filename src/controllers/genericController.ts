import { Request, Response, NextFunction } from 'express';
import { Document, Model, Types, modelNames } from 'mongoose';
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import Email from "../services/email";
import Changelog from "../models/changelog.model";
import CustomError from "../utilities/errors/customError";
import Table, { ITablePreference } from '../models/tablePreference.model';

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
            //req.body.account = req.headers.account; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
            this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let { document, saved } = await this.model.addDocument(mode, req.body.document);
            //populate response document
            await document.autoPopulate();
            document = document.constantTranslate(req.locale);
            res.json({ status: "success", data: { document, saved } });
        } catch (error) {
            return next(error);
        }
    }


    async get(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode } = req.params;
        let { field } = req.query;
        try {
            this.model = this.model.setAccount(req.headers.account, req.headers.user);

            let document = await this.model.getDocument(id, mode, (field || "_id").toString());

            if (!document) {
                throw new CustomError("doc_not_found", 404);
            } else {
                //populate response document
                await document.autoPopulate();
                let docObject = document.constantTranslate(req.locale);
                res.json({ status: "success", data: { document: docObject, mode: mode === "advanced" ? mode : "simple" } });


            }
        } catch (error) {
            return next(error);
        }
    }

    public async save(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        try {
            this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let { document_id, saved } = await this.model.saveDocument(id, req.body.document);
            if (!document_id) {
                throw new CustomError("doc_not_found", 404);
            } else {
                res.json({ status: "success", data: { document_id, saved } });
            }

        } catch (error) {
            return next(error);
        }
    }

    public async options(req: Request, res: Response, next: NextFunction) {
        let { recordtype, mode, id } = req.params;
        try {
            this.model = this.model.setAccount(req.headers.account, req.headers.user);

            let field = req.body;
            let page = parseInt((req.query.page || 1).toString());
            let keyword = (req.query.keyword || "").toString();

            let { results, total } = await this.model.getOptions(id, mode, field, page, keyword);
            const data = {
                docs: results,
                totalDocs: total,
                limit: results.length == total ? total : 25,
                page: page,
                totalPages: results.length == total ? 1 : Math.ceil(total / 25)
            }
            res.json({ status: "success", data: data });


        } catch (error) {
            return next(error);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        let { recordtype, mode, id } = req.params;
        let { field } = req.query;
        try {
            this.model = this.model.setAccount(req.headers.account, req.headers.user);
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
            let { document, saved } = await this.model.updateDocument(id, mode, (field || "_id").toString(), update);
            if (!document) {
                throw new CustomError("doc_not_found", 404);
            } else {
                
                //populate response document
                await document.autoPopulate();
                document = document.constantTranslate(req.locale);
                res.json({ status: "success", data: { document, saved } });
            }

        } catch (error) {
            return next(error);
        }
    }
    public async massUpdate(req: Request, res: Response, next: NextFunction) {
        let { recordtype } = req.params;
        let { field } = req.query;
        try {
            this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let documents = req.body;
            let savedDocuments: any = []
            for (let update of documents) {
                let { document, saved } = await this.model.updateDocument(update._id, "simple", (field || "").toString(), update);
                savedDocuments.push(saved)
                if (!document) {
                    savedDocuments.push(false)
                }
            }
            res.json({ status: "success", data: { saved: savedDocuments } });

        } catch (error) {
            return next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        try {// to do - do poprawy
            this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let document = await this.model.deleteDocument(id);
            res.json({ status: "success", data: { document } });
        } catch (error) {
            return next(error);
        }
    }
    public async send(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        let config = req.body;
        try {
            let status = await Email.send(config);
            res.json(status);
        } catch (error) {
            return next(error);
        }
    }
    public async fields(req: Request, res: Response, next: NextFunction) {
        let { recordtype } = req.params;
        let { table } = req.query;
        let preference: any = undefined;
        let selected: any = undefined;
        try {
            let fields = await this.model.getFields(req.locale);

            if (table) {
                await Table.setAccount(req.headers.account, req.headers.user).findOne({ table: table.toString() }).then(res => {
                    if (res) {
                        preference = res._id;
                        selected = res.selected;
                    }
                })
            }
            res.json({ status: "success", data: { table, preference, selected, fields } });
        } catch (error) {
            return next(error);
        }
    }
    public async form(req: Request, res: Response, next: NextFunction) {
        let { recordtype } = req.params;
        try {
            this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let form = await this.model.getForm(req.locale);

            res.json({ status: "success", data: { form } });
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
            const data = {
                docs: changelogs,
                totalDocs: changelogs.length,
                limit: changelogs.length,
                page: 1,
                totalPages: 1
            }


            res.json({ status: "success", data });
        } catch (error) {
            return next(error);
        }
    }
    public async activities(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        try {
            let query: any = { document: id, subdoc: { $exists: false }, field: { $in: ['name', 'status', 'email', 'memo'] } };
            let results = await Changelog.find(query).sort({ _id: -1 })
                .populate({ path: 'newValue', select: 'name' })
                .populate({ path: 'oldValue', select: 'name' })
                .populate({ path: 'createdBy', select: 'name' })
                .exec();
            // parse to plain result
            let activities = results.map((line: any) => {
                return {
                    _id: line._id,
                    type: "changeValue",
                    name: `Changed important data (${line.field})`,
                    description: `${line.oldValue} to: ${line.newValue}`,
                    // newValue: line.newValue && line.newValue.name ? line.newValue.name : line.newValue,
                    // oldValue: line.oldValue && line.oldValue.name ? line.oldValue.name : line.oldValue,
                    time: new Date(line.createdAt),
                    //field: line.field,
                    //list: line.list,
                    createdBy: line.createdBy ? line.createdBy.name : ""
                }
            })

            activities.push({
                _id: "email",
                type: "sentEmail",
                name: `Order confirmation email was sent: SO#1234`,
                description: "www.shop.online",
                time: getRandomDateFromLastWeek(),
                createdBy: ""
            })

            activities.push({
                _id: "payment",
                type: "payment",
                name: `Payment was processed on PayPal Express`,
                description: "www.shop.online",
                time: getRandomDateFromLastWeek(),
                createdBy: ""
            })

            activities.push({
                _id: "sales",
                type: "sales",
                name: `Customer placed this order on Online Store`,
                description: "www.shop.online",
                time: getRandomDateFromLastWeek(),
                createdBy: ""
            })

            activities = sortByDate(activities, "time").reverse()
            res.json({ status: "success", data: { activities } });
        } catch (error) {
            return next(error);
        }
    }
    public async find(req: Request, res: Response, next: NextFunction) {

        try {
            // prefernecje tabeli przekazane w query
            let { table } = req.query;
            let preference: ITablePreference | null = null;
            if (table) {
                preference = await Table.setAccount(req.headers.account, req.headers.user).findOne({ table: table.toString() });
            }

            this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let query: any = {};

            let options = { select: { name: 1, type: 1, resource: 1 }, sort: {}, limit: 50, skip: 0 };

            // filters
            let filters = (req.query.filters || "").toString();
            if (filters) {
                query = filters.split(",").reduce((o, f) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
            } else {
                if (preference && preference.filters) {
                    // to do - opisać wszystkie operatory
                    query = preference.filters.filter(f => f.value != undefined).reduce((t, f) => {
                        t = {};
                        let operator = "$eq";
                        let value = {};
                        if (Array.isArray(f.value)) {
                            value[f.operator] = f.value
                        }
                        else {
                            value[f.operator] = f.value
                            //['$expr'][filter.operator] = [`$${filter.field}`, filter.value];
                            //value = { $regex: `${f.value}.*`, $options: "i" }
                        }

                        t[f.field] = value;

                        return t;
                    }, {});
                }
            }
            // selected
            let select = (req.query.select || req.query.fields || "").toString();
            if (select) {
                options.select = select.split(",").reduce((o, f) => { o[f] = 1; return o; }, { name: 1, type: 1, resource: 1, deleted: 1 });
            } else {
                // sprawdź preferencje użytkownika
                if (preference) {
                    options.select = preference.selected.reduce((t, s) => { t[s] = 1; return t; }, { name: 1, type: 1, resource: 1, deleted: 1 });
                } else {
                    // add default field to select
                    this.model.getSelect().forEach(field => {
                        options.select[field] = 1;
                    })
                }
            }

            // Sort
            let sort = (req.query.sort || "").toString();
            let sortArray: any = [];
            if (sort) {
                sortArray = sort.split(",");
            } else {
                if (preference && preference.sortBy) {
                    sortArray = preference.sortBy.map(s => s.order === "desc" ? `-${s.key}` : s.key);
                }
            }
            sortArray.reduce((o, f) => {
                // -date = desc sort per date field
                if (f[0] == "-") {
                    f = f.substring(1);
                    o[f] = -1;
                } else {
                    o[f] = 1;
                }
                return o;
            }, {});


            // search by keyword
            let search = (req.query.search || "").toString();
            if (search) {
                query[(req.query.field || 'name').toString()] = { $regex: `${req.query.search}` }
            }

            // loop per query params
            for (const [key, value] of Object.entries(req.query)) {
                // if (["filters", "select", "fields", "search", "sort", "page", "limit"].includes(key))
                //     query[key] = { $eq: value }
                // add verify field exists
            }


            options.limit = parseInt((req.query.limit || 50).toString());
            if (preference && preference.itemsPerPage) options.limit = parseInt((preference.itemsPerPage || 50).toString());

            options.skip = parseInt((req.query.skip || ((Number(req.query.page || 1) - 1) * options.limit) || 0).toString());

            //let result = await this.model.findDocuments(query, options);
            let total = await this.model.countDocuments(query);
            let page = req.query.page || 1;

            // get fields
            let fields = this.model.getFields(req.locale).filter((field: any) => options.select[field.field])

            const data = {
                totalDocs: total,
                limit: options.limit,
                totalPages: Math.ceil(total / options.limit)
            }
            if (!req.query.count) {
                let result = await this.model.findDocuments(query, options);
                // get fields
                let fields = this.model.getFields(req.locale).filter((field: any) => options.select[field.field])
                for (let index in result) {
                    // console.log(result[index])
                    //result[index] = new this.model(result[index]);
                    result[index] = await result[index].constantTranslate(req.locale);
                }

                data["docs"] = result;
                data["page"] = page;

            }

            res.json({ status: "success", data: data });
        } catch (error) {
            return next(error);
        }
    }
}

export default GenericController;

function getRandomDateFromLastWeek() {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

    const randomDate = new Date(sevenDaysAgo.getTime() + Math.random() * (now.getTime() - sevenDaysAgo.getTime()));
    return randomDate;
}
function sortByDate(array: any[], field: string = "date") {
    return array.sort((a, b) => { return new Date(a[field]).getTime() - new Date(b[field]).getTime() });
}