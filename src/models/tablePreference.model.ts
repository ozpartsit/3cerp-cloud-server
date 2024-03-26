import { Schema, model, Model, models } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";



interface IFilter {
    field: string;
    operator: string;
    value?: any | any[];
    ref?: string;
    constant?: string;
}
interface IFilterGroup {
    filters: IFilter[];
    operator: string;
}
interface ISortBy {
    key: string;
    order: string;
}
export interface ITablePreference extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    account: Schema.Types.ObjectId;
    type: string;
    table: string;
    selected: string[];
    sortBy?: ISortBy[];
    groupBy?: string[];
    itemsPerPage?: number;
    filters?: IFilterGroup[];
    _someFunction(): any
}

// filter




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
        sortBy: {
            type: [{
                key: String,
                order: String,
            }]
        },
        groupBy: { type: [String] },
        itemsPerPage: { type: Number },
        filters: {
            autopopulate: true,
            type: [{
                operator: {
                    type: String,
                    required: true,
                    input: "Select",
                    default: '$and',
                },
                filters: {
                    type: [{
                        field: {
                            type: String,
                        },
                        operator: {
                            type: String,
                            required: true,
                            input: "Select",
                            constant: 'operator',
                        },
                        value: { type: Schema.Types.Mixed, refPath: 'ref', autopopulate: true },
                        ref: {
                            type: String,
                        },
                        constant: {
                            type: String,
                        },
                    }]
                }
            }]

        },
    },
    options
);

schema.pre('save', async function () {
    if (this.filters) {
        this.filters.forEach(fg => {
            //to do - do poprawienia
            fg.filters.forEach(f => {
                if (f.value) {
                    if (Array.isArray(f.value)) {
                        f.value = f.value.map(v => v._id ? v._id : v)
                    } else {
                        if (f.value._id) f.value = f.value._id;
                    }
                }
            })
        })
    }
});



schema.virtual('fields').get(function (this: ITablePreference) {
    let sources = this.table.split(".");
    let model = Object.keys(models).find(model => model.toLowerCase() == sources[0].toLowerCase());

    // Uzupełnienie Ref i Constatnt
    this._someFunction()


    if (model) {
        if (models[model]) {
            //console.log(models[model].collection.name)
            let fields = (models[model] as any).getFields("en", "", false, true);
            if (sources[1]) {
                let subdoc = fields.find(f => f.field == sources[1])
                if (subdoc)
                    return subdoc.fields;
                else fields.filter(field => field.control != "Table");
            }
            return fields.filter(field => field.control != "Table");
        }
    }
});



schema.statics.defaultDocument = function (table) {
    let doc = new this({ table })
    doc.save();
    return doc;

};

schema.methods._someFunction = function () {
    if (this.filters) {
        let sources = this.table.split(".");
        let model = Object.keys(models).find(model => model.toLowerCase() == sources[0].toLowerCase());

        if (model) {
            for (let filterGroup of this.filters) {
                for (let filter of filterGroup.filters) {
                    let fields = (models[model] as any).getFields("en", "", false, true);
                    if (sources[1]) {
                        let subdoc = fields.find(f => f.field == sources[1])
                        if (subdoc)
                            fields = subdoc.fields;
                        else fields.filter(field => field.control != "Table");
                    }

                    fields = fields.filter(field => field.control != "Table");

                    let field = fields.find(f => f.field == filter.field);

                    if (field) {
                        filter.constant = field.constant;
                        filter.ref = field.type;
                        //filter.field = { _id: field.field }
                    }
                }
            }
        }

    }

}

schema.index({ name: 1 });

const Table: ITablePreferenceModel = model<ITablePreference, ITablePreferenceModel>(
    "Table",
    schema
);
export default Table;
