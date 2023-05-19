import { Schema, Model, model } from "mongoose";
import { IActivity } from "../schema";
import { IExtendedDocument } from "../../../utilities/methods";
import { IExtendedModel } from "../../../utilities/static";
import { IGroup } from "./group.schema";
import { ITag } from "./tag.schema";
export interface ITask extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    activity: IActivity["_id"];
    description: string;
    name: string;
    date: Date;
    endDate: Date;
    group: IGroup["_id"];
    type: string;
    tags: Schema.Types.ObjectId[]
    index: number;
}

export interface ITaskModel extends Model<ITask>, IExtendedModel { }

const options = {
    discriminatorKey: "activity",
    collection: "activities.tasks_events",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<ITask>(
    {
        index: {
            type: Number
        },
        activity: { type: Schema.Types.ObjectId },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'Task',
            required: true,
        },
        description: {
            type: String,
            default: ""
        },
        date: { type: Date },
        endDate: { type: Date },
        group: { type: Schema.Types.ObjectId },
        tags: {
            type: [Schema.Types.ObjectId],
            ref: "Tag",
            autopopulate: { select: "name displayname color" },
        }
    },
    options
);

const Task: ITaskModel = model<ITask, ITaskModel>("Task", schema);
export default Task;
