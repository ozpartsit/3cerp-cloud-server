import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
//import { Changelog as ChangelogClass } from "../shared/recordtype";
export interface IChangelog extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    document: Schema.Types.ObjectId;
    type: string;
    entity: Schema.Types.ObjectId;
    field: string;
    list: string;
    record: Schema.Types.ObjectId;
    newValue: string | Date | Schema.Types.ObjectId;
    oldValue: string | Date | Schema.Types.ObjectId;
    ref: string
}

interface IChangelogModel extends Model<IChangelog>, IExtendedModel<IChangelog> { }

export const schema = new Schema<IChangelog>(
    {
        document: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        type: {
            type: String,
            required: true,
            default: "Changelog"
        },
        entity: {
            type: Schema.Types.ObjectId
        },
        field: {
            type: String,
            required: true,
        },
        list: {
            type: String,
        },
        record: {
            type: Schema.Types.ObjectId,

        },
        newValue: {
            refPath: 'ref',
            autopopulate: true,
            type: Schema.Types.Mixed,
        },
        oldValue: {
            refPath: 'ref',
            autopopulate: true,
            type: Schema.Types.Mixed,
        },
        ref: {
            type: String,
        },
    },
    {
        collection: "changelogs",
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
);
schema.index({ name: 1 });
schema.index({ document: 1 });

const Changelog: IChangelogModel = model<IChangelog, IChangelogModel>("Changelog", schema);
Changelog.init().then(function (Event) {
    console.log('Changelog Builded');
})
export default Changelog;

