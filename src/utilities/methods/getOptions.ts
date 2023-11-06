import { models, Model } from "mongoose";
import { IExtendedDocument } from "../methods"
import { IExtendedModel } from "../static";
import constants from "../../constants";
import path from "path";
import i18n from "../../config/i18n";

export default async function getOptions<T extends IExtendedDocument>(
    this: T,
    field: string,
    subdoc: string,
    subdoc_id: string,
    deepdoc: string,
    deepdoc_id: string,
    page: number,
    keyword: string
) {
    try {
        let document: T;
        if (subdoc) {
            let virtual: any = this.schema.virtuals[subdoc];
            document = this[subdoc].find((element: any) => {
                return element._id.toString() === subdoc_id;
            });

            if (deepdoc) {

                subdoc = deepdoc;
                if (!document) throw 'bład'
                else {
                    let parent = document;
                    virtual = parent.schema.virtuals[subdoc];
                    document = parent[subdoc].find((element: any) => {
                        return element._id.toString() === deepdoc_id;
                    });
                }
            }

            if (!document) {
                if (virtual) {
                    document = await new models[virtual.options.ref]();
                    document.initLocal();
                    if (virtual.options.justOne) {
                        this[subdoc] = document;
                    } else {
                        this[subdoc].push(document);
                    }

                    this.validateVirtuals(false);
                } else {
                    console.log(this.schema.path(subdoc))
                }
            }

        } else {
            document = this;
        }


        // Pobierz definicję schematu (schema) modelu 
        const schema = document.schema;

        // Sprawdź typ pola "name"
        const fieldType = schema.path(field);

        if (fieldType) {
            let results: any = [];
            let total = 0;
            if (fieldType.options.ref) {
                let model = models[fieldType.options.ref] as IExtendedModel<T>;

                // query - dodać filtry 
                let query = fieldType.options.filters || {};
                if (keyword) query.name = { $regex: `.*${keyword}.*` }

                total = await model.count(query);
                let limit = 25;
                let skip = ((page || 1) - 1) * 25;
                results = await model.find(query).sort({ name: 1 }).skip(skip).limit(limit).select({ name: 1, description: 1, type: 1 });
                //let results = model.findDocuments({},{})

            }

            if (fieldType.options.constant) {

                // i18n
                // i18n.configure({
                //     directory: path.resolve(__dirname, "../constants/locales")
                // });
                if (constants[fieldType.options.constant]) {
                    if (fieldType.options.filters) {
                        // zastosowanie filtrów
                        results = constants[fieldType.options.constant].filter((c: any) => fieldType.options.filters(this))
                    } else {
                        results = constants[fieldType.options.constant];
                    }
                    if (keyword) {
                        results = results.filter(c => c.include(keyword))
                    }

                    total = results.length;
                    // tłumaczenie
                    results = results.map((value: any) => {
                        return { _id: value, name: i18n.__(value) }
                    })
                }
            }
            return { results, total }
        }
        else return { results: [], total: 0 }


    } catch (err) {
        return err;
    }
}
