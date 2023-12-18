import i18n from "../../config/i18n";
import { IExtendedDocument } from "../methods"
export default function constantTranslate<T extends IExtendedDocument>(this: T, local: string) {

    let doc = this.toObject();

    // Virtuals
    const virtuals: any[] = Object.values(this.schema.virtuals);
    for (let list of virtuals) {
        if (list.options.ref && list.options.autopopulate) {
            if (Array.isArray(this[list.path])) {
                for (let index in doc[list.path]) {
                    doc[list.path][index] = this[list.path][index].constantTranslate(local);
                }

            }
        }
    }

    for (const [pathname, schemaType] of Object.entries<any>(this.schema.paths)) {
        i18n.setLocale(local || "en");
        //constats
        if (schemaType.options.constant) {
            if (schemaType._presplitPath.length > 1) {
                let subdoc = doc[schemaType._presplitPath[0]];
                if (subdoc && subdoc[schemaType._presplitPath[1]])
                    subdoc[schemaType._presplitPath[1]] = { _id: subdoc[schemaType._presplitPath[1]], name: i18n.__(`${schemaType.options.constant}.${subdoc[schemaType._presplitPath[1]]}`) };
            } else {

                if (doc[pathname]) doc[pathname] = {
                    _id: doc[pathname], name: i18n.__(`${schemaType.options.constant}.${doc[pathname]}`)
                };
            }
        }
        if (["Embedded"].includes(schemaType.instance)) {
            if (schemaType.schema) for (const [key, value] of Object.entries<any>(schemaType.schema.tree)) {
                if (value.constant) {
                    if (doc[pathname] && doc[pathname][key]) doc[pathname][key] = {
                        _id: doc[pathname][key], name: i18n.__(`${value.constant}.${doc[pathname][key]}`)
                    };
                }
            }
        }
    }
    return doc;
}