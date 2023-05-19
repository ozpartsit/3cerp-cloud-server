import { Schema, Model, model } from "mongoose";
import { IActivity } from "../schema";
import { IExtendedDocument } from "../../../utilities/methods";
import { IExtendedModel } from "../../../utilities/static";

export interface ITaskStatus extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    activity: IActivity["_id"];
    description: string;
    name: string;
    color: string;
    index: number;
    type: string;
}

export interface ITaskStatusModel extends Model<ITaskStatus>, IExtendedModel { }

const options = {
    discriminatorKey: "type",
    collection: "activities.classification",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<ITaskStatus>(
    {
        index: {
            type: Number
        },
        activity: { type: Schema.Types.ObjectId },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: ""
        },
        type: {
            type: String
        },
        color: {
            type: String,
            default: "#e1e1e1"
        },
    },
    options
);

const TaskStatus: ITaskStatusModel = model<ITaskStatus, ITaskStatusModel>("TaskStatus", schema);
export default TaskStatus;
