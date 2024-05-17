import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
//import { Changelog as ChangelogClass } from "../shared/recordtype";
export interface IChangelog extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    document: mongoose.Schema.Types.ObjectId;
    type: string;
    entity: mongoose.Schema.Types.ObjectId;
    field: string;
    subdoc: string;
    subdoc_id: mongoose.Schema.Types.ObjectId;
    newValue: string | Date | mongoose.Schema.Types.ObjectId;
    oldValue: string | Date | mongoose.Schema.Types.ObjectId;
    ref: string
    createdBy: mongoose.Schema.Types.ObjectId
}

interface IChangelogModel extends mongoose.Model<IChangelog>, IExtendedModel<IChangelog> { }

export const schema = new mongoose.Schema<IChangelog>(
    {
        document: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        type: {
            type: String,
            required: true,
            default: "Changelog"
        },
        entity: {
            type: mongoose.Schema.Types.ObjectId
        },
        field: {
            type: String,
            required: true,
        },
        subdoc: {
            type: String,
        },
        subdoc_id: {
            type: mongoose.Schema.Types.ObjectId,

        },
        newValue: {
            refPath: 'ref',
            autopopulate: true,
            type: mongoose.Schema.Types.Mixed,
        },
        oldValue: {
            refPath: 'ref',
            autopopulate: true,
            type: mongoose.Schema.Types.Mixed,
        },
        ref: {
            type: String,
        },
        createdBy: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        }
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

const Changelog: IChangelogModel = mongoose.model<IChangelog, IChangelogModel>("Changelog", schema);
Changelog.init().then(function (Event) {
    console.log('Changelog Builded');
})
export default Changelog;

