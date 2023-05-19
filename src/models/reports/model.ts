import { Schema, Model, model, models } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
import i18n from "../../config/i18n";
export interface IReport extends IExtendedDocument {
    name: string;
    description: string;
    type: string;
    columns: any[];
    filters: any[];
    getResults(): any;
}
interface IReportModel extends Model<IReport>, IExtendedModel { }

export const schema = new Schema<IReport>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            required: true,
            default: "report"
        },
        columns: {
            type: []
        },
        filters: {
            type: []
        }
    },
    {
        collection: "reports",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
//
schema.virtual('fields').get(function (this: any) {
    let model: any = models["Transaction"];
    return model.getFields()
});



schema.method("getResults", async function () {
    let results: any = [];
    let sort = { _id: 1 };
    let select = { type: true }
    let query = {}

    let populated: any = {};
    for (let column of this.columns) {
        // to do - poprawić
        let fields = column.field.split('.');
        if (fields.length > 1) {

            if (populated[fields[0]]) {
                populated[fields[0]].select[fields[1]] = 1;
                populated[fields[0]].populate.push({
                    path: fields[1],
                    select: 'name resource type'
                })
            } else {
                let fieldsSelect = { name: 1 };
                fieldsSelect[fields[1]] = 1;
                populated[fields[0]] = {
                    path: fields[0],
                    select: fieldsSelect,
                    populate: [{
                        path: fields[1],
                        select: 'name resource type'
                    }]
                }
            }

        } else {
            select[column.field] = true
        }
    }
    //console.log(populated, select)
    //await this.find(query)
    //.populate(populated)
    //.sort(sort).skip(skip).limit(limit).select(select);
    //console.log(populated)
    let data = await model("Transaction").find(query)
        .populate(Object.values(populated))
        .sort(sort)
        .select(select);

    results = data.map((line: any) => {
        let row = { _id: line._id, type: line.type, resource: line.resource };
        this.columns.forEach(c => {
            let fields = c.field.split('.');
            let value: any = undefined;
            fields.forEach((field: string, index: number) => {
                if (index) {
                    value = value[field];
                } else
                    value = line[field];
            })
            if (c.constant) value = { _id: value, name: i18n.__(value) };
            row[c.field] = value;
        })
        return row;
    })

    return results;
});

schema.index({ name: 1 });

const Report: IReportModel = model<IReport, IReportModel>("Report", schema);
export default Report;

