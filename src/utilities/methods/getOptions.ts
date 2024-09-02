import * as mongoose from "mongoose";
import { IExtendedDocument } from "../methods"
import { IExtendedModel } from "../static";
import constants from "../../constants/index.js";
import path from "path";
import i18n from "../../config/i18n";

export default async function getOptions(
    this: IExtendedDocument,
    field: string,
    subdoc: string | null = null,
    subdoc_id: string | null = null,
    deepdoc: string | null = null,
    deepdoc_id: string | null = null,
    page: number,
    keyword: string,
    mode: string | null = null,
) {
    try {
        let document: IExtendedDocument | null = null;
        if (subdoc) {
            let virtual: any = this.schema.virtuals[subdoc];
            if (virtual && !virtual.options.justOne) {
                if (!this[subdoc]) this[subdoc] = [];
                if (subdoc_id) {
                    document = this[subdoc].find((element: any) => {
                        return element._id.toString() === subdoc_id;
                    });
                }
            }

            if (!document) {
                if (virtual) {
                    let Model = mongoose.model(virtual.options.ref);
                    document = await new Model() as IExtendedDocument;
                    document.initLocal();
                    if (subdoc_id) {
                        if (virtual.options.justOne) {
                            this[subdoc] = document;
                        } else {
                            if (!this[subdoc]) this[subdoc] = [];
                            this[subdoc].push(document);
                        }
                    }
                    this.validateVirtuals(false);
                    if (deepdoc) return document.getOptions(field, deepdoc, deepdoc_id, null, null, page, keyword, mode)
                } else {
                    document = this;
                    const fieldType = this.schema.path(subdoc);
                    if (fieldType && fieldType.options.ref) {
                        let Model = mongoose.model(fieldType.options.ref)
                        document = new Model()
                        if (!document) document = this;
                    } else
                        field = `${subdoc}.${field}`;
                }
            }
        } else {
            document = this;
        }
        
        // Pobierz definicję schematu (schema) modelu 
        const schema = document.schema;

        // Sprawdź typ pola "name"
        const fieldType = schema.path(field) || schema.virtuals[field];
        //console.log(schema.paths)
        if (fieldType) {
            let results: any = [];
            let total = 0;
            let constant = fieldType.options.constant;
            if (mode === "operator") {
                constant = "operator";
            } else {
               
                if (fieldType.options.ref) {
                 
                    let model = mongoose.model(fieldType.options.ref);
                    // query - dodać filtry 
                    let query = fieldType.options.filters || {};
                    if (keyword) query.name = { $regex: `.*${keyword}.*` }

                    total = await model.countDocuments(query);
                    let limit = 25;
                    let skip = ((page || 1) - 1) * 25;
                    results = await model.find(query).sort({ name: 1 }).skip(skip).limit(limit).select({ name: 1, description: 1, type: 1 });
                    //let results = model.findDocuments({},{})

                }
            }


            if (constant) {

                // i18n
                // i18n.configure({
                //     directory: path.resolve(__dirname, "../constants/locales")
                // });
                if (constants[constant]) {
                    if (fieldType.options.filters) {
                        // zastosowanie filtrów
                        results = constants[constant].filter((c: any) => fieldType.options.filters(this))
                    } else {
                        results = constants[constant];
                    }


                    // tłumaczenie
                    results = results.map((value: any) => {
                        if (value._id) {
                            return { ...value, name: i18n.__(`${constant}.${value._id}`) }
                        } else {
                            return { _id: value, name: i18n.__(`${constant}.${value}`) }
                        }
                    })

                    if (keyword) {
                        results = results.filter((c: any) => c.name.toLowerCase().includes(keyword.toLowerCase()))
                    }

                    total = results.length;
                    if (page) {
                        let skip = ((page || 1) - 1) * 25;
                        results = results.filter((item, index) => index >= skip && index < skip + 25)
                    }

                }
            }
            return { results, total }
        }
        else return { results: [], total: 0 }


    } catch (err) {
        return err;
    }
}
