import { Schema, model, Model, models } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";


export interface ITablePreference extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    account: Schema.Types.ObjectId;
    type: string;
    table: string;
    selected: string[];
    sortBy?: string[];
    groupBy?: string[];
}



// Schemas ////////////////////////////////////////////////////////////////////////////////
interface ITablePreferenceModel extends Model<ITablePreference>, IExtendedModel<ITablePreference> { }

const options = {
    discriminatorKey: "type", collection: "preferences", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<ITablePreference>(
    {
        account: { type: Schema.Types.ObjectId, required: true },
        user: { type: Schema.Types.ObjectId, required: true },
        table: { type: String },
        selected: { type: [String] },
        sortBy: { type: [String] },
        groupBy: { type: [String] },
    },
    options
);

schema.virtual('fields').get(function (this: ITablePreference) {
    let sources = this.table.split(".");
    let model = Object.keys(models).find(model => model.toLowerCase() == sources[0].toLowerCase());
    if (model) {
        if (models[model]) {
            let fields = (models[model] as any).getFields("en", "", false, false);
            if (sources[1]) {
                let subdoc = fields.find(f => f.field == sources[1])
                if (subdoc)
                    return subdoc.fields;
                else fields;
            }
            return fields;
        }
    }

});


schema.statics.defaultDocument = function (table) {
    let doc = new this({ table })
    doc.save();
    return doc;

};

schema.index({ name: 1 });

const Table: ITablePreferenceModel = model<ITablePreference, ITablePreferenceModel>(
    "Table",
    schema
);
export default Table;
