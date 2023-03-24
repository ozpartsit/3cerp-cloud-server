import { Schema, Model, model } from "mongoose";
import { IActivity } from "../schema";
import { IExtendedDocument } from "../../../utilities/methods";
import { IExtendedModel } from "../../../utilities/static";

export interface IGroup extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    activity: IActivity["_id"];
    description: string;
    name: string;
    color: string;
}

export interface IGroupModel extends Model<IGroup>, IExtendedModel { }

const options = {
    discriminatorKey: "type",
    collection: "activities.classification",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IGroup>(
    {
        activity: { type: Schema.Types.ObjectId },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: "#e1e1e1"
        },
    },
    options
);

const Group: IGroupModel = model<IGroup, IGroupModel>("Group", schema);
export default Group;
