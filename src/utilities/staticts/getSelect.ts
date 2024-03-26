import { Schema, Model, Document, models } from "mongoose";
import { IExtendedDocument } from "../methods"
export default function getSelect<T extends IExtendedDocument>(this: Model<T>, parent?: string) {
    let fields: string[] = ["name", "type", "resource"];
    let modelSchema = this.schema;

    // to do - dodac tylko justOne
    // interface Virtuals {
    //     [key: string]: any;
    // }
    // const virtuals: Virtuals = modelSchema.virtuals;
    // Object.entries(virtuals).forEach(([key, value]) => {
    //     if (!parent && value && value.options.ref) {
    //         if (value.options.ref) {
    //             let refModel: any = models[value.options.ref];
    //             refModel.getSelect(key).forEach(f => {
    //                 fields.push(`${key}.${f}`)
    //             });
    //         }
    //     }
    // });

    for (const [pathname, schematype] of Object.entries<any>(modelSchema.paths)) {
        // console.log(pathname,schematype.options.ref)
        //if(schematype.options.defaultSelect) {
        fields.push(schematype.path)
        if (["Embedded", "Array"].includes(schematype.instance)) {

            if (!parent && schematype.schema) for (const [key, value] of Object.entries<any>(schematype.schema.tree)) {
                if (schematype.options.defaultSelect)
                    fields.push(`${pathname}.${key}`)
            }
        } else {
            if (schematype.options.ref && !parent) {
                //console.log(schematype.options.ref)
                let refModel: any = models[schematype.options.ref];

                if (refModel) {
                    schematype.options.resource = refModel.schema.options.collection;
                    refModel.getSelect(pathname, pathname).forEach(f => {
                        fields.push(f)
                    });
                }
            }

        }
        //    }
    }
    fields = [...new Set(fields)];
    //console.log(fields)
    return fields;
}


