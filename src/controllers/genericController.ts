import { Request, Response, NextFunction } from 'express';
import { Document, models, Types, modelNames } from 'mongoose';
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import EmailService from "../services/email";
import Changelog from "../models/changelog.model";
import CustomError from "../utilities/errors/customError";
import Table, { ITablePreference } from '../models/tablePreference.model';
import Transactions from '../models/transactions/schema';
import Email from '../models/email.model';
import { FavoritesTypes } from '../models/favorites/model'

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
            if (!req.body.document) req.body.document = {}
            req.body.document.account = req.headers.account; // to do - przypisanie ownerAccount dla każdego nowego dokumentu

            if (this.model.userRequired()) req.body.document.user = req.headers.user;
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
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
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let document = await this.model.getDocument(id, mode, true, (field || "_id").toString());
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

    async table(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode, table } = req.params;
        //let { field, page } = req.query;
        try {
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let document = await this.model.getDocument(id, mode, false, ("_id").toString());

            if (!document) {
                throw new CustomError("doc_not_found", 404);
            } else {
                //populate response document
                await document.autoPopulate();
                let docObject: any = document.constantTranslate(req.locale, true);
                let results = docObject[table];
                let total = results.length;


                let preference: ITablePreference | null = null;
                if (table) {
                    table = `${this.model.modelName}.${table.toString()}`;
                    preference = await Table.findOne({ table: table, user: req.headers.user });
                    if (!preference) preference = await new Table({ table: table.toString(), user: req.headers.user, account: req.headers.account }).save();
                }
                //this.s = this.model.setAccount(req.headers.account, req.headers.user);
                let query: any = {};
                let options = { select: { name: 1, type: 1, resource: 1 }, sort: {}, limit: 50, skip: 0 };

                // filters
                let filters = (req.query.filters || "").toString();
                if (filters) {
                    query = filters.split(",").reduce((o: any, f: any) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
                } else {
                    if (preference && preference.filters && preference.filters.length) {
                        query = { $and: [] }
                        // to do - opisać wszystkie operatory
                        preference.filters.filter(fg => fg.filters.length).forEach(fg => {
                            let filterGroup: any = {};
                            filterGroup[fg.operator] = [];
                            filterGroup[fg.operator] = fg.filters.filter(f => f.value != undefined).reduce((t: any, f) => {
                                let filter: any = {}
                                let value: any = {};
                                if (Array.isArray(f.value)) {
                                    value[f.operator] = f.value
                                }
                                else {
                                    value[f.operator] = f.value
                                    //['$expr'][filter.operator] = [`$${filter.field}`, filter.value];
                                    //value = { $regex: `${f.value}.*`, $options: "i" }
                                }
                                filter[f.field] = value;
                                t.push(filter)
                                // console.log(filter)
                                return t;
                            }, []);

                            query.$and.push(filterGroup)
                        })

                    }
                }
                if (query && query.$and && !query.$and.length) query = {}

                // selected
                let select = (req.query.select || req.query.fields || "").toString();
                if (select) {
                    options.select = select.split(",").reduce((o: any, f: any) => { o[f] = 1; return o; }, { name: 1, type: 1, resource: 1, deleted: 1 });
                } else {
                    // sprawdź preferencje użytkownika
                    if (preference) {
                        options.select = preference.selected.reduce((t: any, s: any) => { t[s] = 1; return t; }, { name: 1, type: 1, resource: 1, deleted: 1 });
                    } else {
                        // add default field to select
                        this.model.getSelect().forEach((field: any) => {
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
                options.sort = sortArray.reduce((o: any, f: any) => {
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
                // if (search) {
                //     if (req.query.field && (req.query.field == "_id" || req.query.field == "document"))
                //         query[req.query.field] = req.query.search;
                //     else
                //         query[(req.query.field || 'name').toString()] = { $regex: `${req.query.search}` }
                // }


                if (search) {
                    results = results.filter((row: any) => {
                        let status = false;
                        Object.keys(options.select).forEach(s => {
                            //to do - ignorować niektóe pola jak type czy resource
                            if (row[s] && JSON.stringify(row[s]).toString().includes(search)) status = true
                        })
                        return status;

                    })
                    total = results.length;

                }



                options.limit = parseInt((req.query.limit || 50).toString());
                if (preference && preference.itemsPerPage) options.limit = parseInt((preference.itemsPerPage || 50).toString());


                const data: any = {
                    totalDocs: total,
                    limit: options.limit,
                    totalPages: Math.ceil(total / options.limit)||1
                }
                if (req.query.page == "last") req.query.page = data.totalPages;
                let page = Number(req.query.page || 1);


                let skip = ((page || 1) - 1) * options.limit;
                results = results.filter((item: any, index: any) => index >= skip && index < skip + options.limit)

                if (!req.query.count) {
                    data["docs"] = results;
                    data["page"] = page;
                }

                if (table) {
                    data["table"] = table;
                }
                if (preference) {
                    data["preference"] = preference._id;
                }
                res.json({ status: "success", data: data });


            }
        } catch (error) {
            return next(error);
        }
    }

    async copy(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode } = req.params;
        let { field } = req.query;
        try {
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let sourceDocument = await this.model.getDocument(id, "simple", true, (field || "_id").toString());

            if (!sourceDocument) {
                throw new CustomError("doc_not_found", 404);
            } else {

                if (this.model.userRequired()) sourceDocument["user"] = req.headers.user;
                sourceDocument = sourceDocument.toObject();
                delete sourceDocument._id;
                let { document, saved } = await this.model.addDocument("advanced", sourceDocument);

                //validateVirtuals
                await document.validateVirtuals();
                //populate response document
                await document.autoPopulate();
                let docObject = document.constantTranslate(req.locale);
                res.json({ status: "success", data: { document: docObject, service: "copy" } });


            }
        } catch (error) {
            return next(error);
        }
    }
    public async save(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        let { field } = req.query;
        try {
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
            if(req.body && req.body.document){
                req.body.document.account = req.headers.account; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
                if (this.model.userRequired()) req.body.document.user = req.headers.user;
            }

            let { document_id, saved } = await this.model.saveDocument(id, (field || "_id").toString(), req.body.document);
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
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);

            let field = req.body;
            let page = parseInt((req.query.page || 1).toString());
            let keyword = (req.query.keyword || "").toString();

            if (!id && !mode) {
                id = "all";
                mode = "operator";
            }
            let { results, total } = await this.model.getOptions(id, mode, field, page, keyword);
            if (results) {
                const data = {
                    docs: results,
                    totalDocs: total,
                    limit: results.length == total ? total : 25,
                    page: page,
                    totalPages: results.length == total ? 1 : Math.ceil(total / 25)
                }
                res.json({ status: "success", data: data });
            } else {
                throw new CustomError("doc_not_found", 404);
            }

        } catch (error) {
            return next(error);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        let { recordtype, mode, id } = req.params;
        let { field } = req.query;
        try {
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
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
            let { document, subdocument, saved } = await this.model.updateDocument(id, mode, (field || "_id").toString(), update);


            let newSubDoc;
            if (update.field == "_id" && update.value == "new") {
                if (update.subdoc) {
                    newSubDoc = document[update.subdoc][document[update.subdoc].length - 1]._id;
                }
            }
            if (!document) {
                throw new CustomError("doc_not_found", 404);
            } else {

                //populate response document
                await document.autoPopulate();
                document = document.constantTranslate(req.locale);
                
                if(subdocument && subdocument.constantTranslate){
                    subdocument = subdocument.constantTranslate(req.locale);
                } 

                res.json({ status: "success", data: { document, subdocument, saved, newSubDoc } });
            }

        } catch (error) {
            return next(error);
        }
    }
    public async massUpdate(req: Request, res: Response, next: NextFunction) {
        let { recordtype } = req.params;
        let { field } = req.query;
        try {
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
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
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let document = await this.model.deleteDocument(id);
            res.json({ status: "success", data: { document } });
        } catch (error) {
            return next(error);
        }
    }
    public async send(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id } = req.params;
        let config = req.body;

        config.account = req.headers.account;
        config.user = req.headers.user;

        try {
            if (id) {
                let type = this.model.modelName.split("_")[0]
                if (type == "Email") {
                    config.email = await this.model.findById(id)
                } else {
                    config.ref = type;
                    config.document = id;
                    config.email = await Email.findById(config.email)
                }
            }
            let status = await EmailService.send(config);
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
                await Table.findOne({ table: table.toString(), user: req.headers.user }).then(res => {
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
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
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
            let total = 0;
            let page: number = Number(req.query.page || 1);
            let limit: number = Number(req.query.limit || 50)

            // parse to plain result
            let options = { sort: { _id: -1 }, limit: 0, skip: 0 };

            // search by keyword
            let search = (req.query.search || "").toString();
            if (!search) {
                total = await Changelog.countDocuments(query);
                options.limit = limit;
                options.skip = parseInt((req.query.skip || ((page - 1) * limit) || 0).toString());
            }



            let results = await Changelog.find(query, null, options)
                .populate({ path: 'newValue', select: 'name' })
                .populate({ path: 'oldValue', select: 'name' })
                .populate({ path: 'createdBy', select: 'name' })
                .exec();

            let changelogs = results.map((line: any) => {
                let field;
                let subdoc;


                //let refModel: any = models[line.ref]
                let docFields = this.model.getFields();

                docFields.forEach((docField: any) => {
                    if (line.subdoc) {
                        if (docField.field == line.subdoc) {
                            subdoc = (({ field, name }) => ({ field, name }))(docField);
                            docField.fields.find((subfield: any) => {
                                if (subfield.field == line.field) {
                                    field = subfield;
                                    return true
                                }
                            })
                        }
                    } else {
                        if (docField.field == line.field) {
                            field = docField;
                            return true
                        }
                    }
                });
                // to do - to poprawy
                if (field)
                    field = (({ field, name, validType, control, resource, type, multiple }) => ({ field, name, validType, control, resource, type, multiple }))(field);

                return {
                    newValue: line.newValue,
                    oldValue: line.oldValue,
                    createdBy: line.createdBy ? line.createdBy.name : null,
                    date: new Date(line.createdAt).toISOString().substr(0, 10),
                    createdAt: line.createdAt,
                    field: field,
                    subdoc: subdoc
                }
            })


            if (search) {
                changelogs = changelogs.filter(log => {
                    if (!log.field) return false;
                    if (log.newValue && log.newValue.toString().includes(search)) return true;
                    if (log.oldValue && log.oldValue.toString().includes(search)) return true;
                    if (log.createdBy && log.createdBy.toString().includes(search)) return true;
                    if (log.date && log.date.toString().includes(search)) return true;
                    if (log.field && log.field.name.toString().includes(search)) return true;
                    return false;
                })
                total = changelogs.length;
                let skip = ((page || 1) - 1) * limit;
                changelogs = changelogs.filter((item, index) => index >= skip && index < skip + limit)
            }
            const data = {
                docs: changelogs,
                totalDocs: total,
                limit: limit,
                page: page,
                totalPages: Math.ceil(total / limit)
            }


            res.json({ status: "success", data });
        } catch (error) {
            return next(error);
        }
    }


    public async transactions(req: Request, res: Response, next: NextFunction) {
        //let preference: ITablePreference | null = null;
        //let { config, table } = req.params;
        //table = config || table || `transaction.${this.model.modelName}.related`
        //preference = await Table.findOne({ table: "relatedtransactions", user: req.headers.user });
        //if (!preference) preference = await new Table({ table: table, user: req.headers.user, account: req.headers.account }).save();
        req.query.table = `transaction.${this.model.modelName}.related`

        const data = await findResult(req, Transactions);

        res.json({ status: "success", data });

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
            const data = await findResult(req, this.model)

            res.json({ status: "success", data: data });
        } catch (error) {
            return next(error);
        }
    }


    public async action(req: Request, res: Response, next: NextFunction) {
        try {
            let { recordtype, id, action } = req.params;

            let update: any = {} // to do - dodać akcje
            let { document, saved } = await this.model.updateDocument(id, 'simple', "_id", update);

            if (!document) {
                throw new CustomError("doc_not_found", 404);
            } else {
                res.json({ status: "success", data: { document_id: document._id, saved } });
            }
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

async function findResult<T extends IExtendedDocument>(req: Request, model: IExtendedModel<T>) {

    try {

        // ustawienia tabeli przekazane w query
        let { table, prefid } = req.query;


        // sprawdzenie zapisanej preferencej gdy podane jest query "table" (identyfikator tabeli)
        let preference: ITablePreference | null = null;
        //if (!table) table = model.modelName;
        if (table || prefid) {
            table = (table || prefid || "").toString();
            preference = await Table.findOne({ table: table.toString(), user: req.headers.user });
            if (!preference) preference = await new Table({ table: table.toString(), user: req.headers.user, account: req.headers.account }).save();
        }

        // inicjowanie obiektu query, options - filtr do findDocuments
        let query: any = {}; // to do - dopsiać interfejs
        let options = { select: { name: 1, type: 1, resource: 1 }, sort: {}, limit: 50, skip: 0 };



        ///////////////////////// filters ////////////////////////////////////
        let { filters } = req.query;
        if (filters) {
            query = filters.toString().split(",").reduce((o: any, f: any) => { let filter = f.split("="); o[filter[0]] = filter[1]; return o; }, {});
        } else {
            if (preference && preference.filters && preference.filters.length) {
                query = { $and: [] }
                // to do - opisać wszystkie operatory
                preference.filters.filter(fg => fg.filters.length).forEach(fg => {
                    let filterGroup: any = {};
                    filterGroup[fg.operator] = [];
                    filterGroup[fg.operator] = fg.filters.filter(f => f.value != undefined).reduce((t: any, f) => {
                        let filter: any = {}
                        let value: any = {};
                        if (Array.isArray(f.value)) {
                            value[f.operator] = f.value
                        }
                        else {
                            value[f.operator] = f.value
                            //['$expr'][filter.operator] = [`$${filter.field}`, filter.value];
                            //value = { $regex: `${f.value}.*`, $options: "i" }
                        }
                        filter[f.field] = value;
                        t.push(filter)
                        return t;
                    }, []);

                    query.$and.push(filterGroup)
                })

            }
        }
        if (query && query.$and && !query.$and.length) query = {};

        //Query document
        let { document } = req.query;
        if (document) {
            query.document = document;
        }


        //////////////////////// selected ////////////////////////////////////////////
        let select = (req.query.select || req.query.fields || "").toString();
        if (select) {
            options.select = select.split(",").reduce((o, f) => { o[f] = 1; return o; }, { name: 1, type: 1, resource: 1, deleted: 1 });
        } else {
            // sprawdź preferencje użytkownika
            if (preference && preference.selected && preference.selected.length) {
                options.select = preference.selected.reduce((t, s) => { t[s] = 1; return t; }, { name: 1, type: 1, resource: 1, deleted: 1 });
            } else {
                // dodaj domyślne pola
                model.getSelect().forEach(field => {
                    options.select[field] = 1;
                })
            }
        }

        ////////////////////////// Sort ///////////////////////////////////
        let { sort } = req.query;
        let sortArray: string[] = [];
        if (sort) {
            sortArray = sort.toString().split(",");
        } else {
            if (preference && preference.sortBy) {
                sortArray = preference.sortBy.map(s => s.order === "desc" ? `-${s.key}` : s.key);
            }
        }

        options.sort = sortArray.reduce((o, f) => {
            // -date = desc sort per date field
            if (f[0] === "-") {
                f = f.substring(1);
                o[f] = -1;
            } else {
                o[f] = 1;
            }
            return o;
        }, {});


        ////////////////////// search by keyword //////////////////////////////////
        let { search, field } = req.query;

        if (search) {
            if (field && (field == "_id" || field == "document"))
                query[field] = search;
            else
                query[(field || 'name').toString()] = { $regex: `${search}` }
        }


        /////////////////// Limit i Skip /////////////////////////////////////////////
        let { limit, page, skip } = req.query;
        options.limit = parseInt((limit || 50).toString());
        if (preference && preference.itemsPerPage) options.limit = parseInt((preference.itemsPerPage || 50).toString());
        options.skip = parseInt((skip || ((Number(page || 1) - 1) * options.limit) || 0).toString());

        ////////////// Estmate Count ///////////////////
        let total = await model.countDocuments(query);


        const data: any = {
            totalDocs: total,
            limit: options.limit,
            totalPages: Math.ceil(total / options.limit)
        }
        let { count } = req.query;
        if (!count) {
            let result = await model.findDocuments(query, options);
            for (let index in result) {
                result[index] = await result[index].constantTranslate(req.locale, true);
            }

            data["docs"] = result;
            data["page"] = page;

            if (table) {
                data["table"] = table;
            }
            if (preference) {
                data["preference"] = preference._id;
            }

            // przekazanie dodatkowych wartości do odpowiedzi
            if (req.body) {
                for (const [key, value] of Object.entries(req.body)) {
                    data[key] = value;
                }
            }
        }
        return data;

    } catch (error) {
        throw error
    }
}