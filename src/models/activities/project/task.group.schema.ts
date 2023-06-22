import { Schema, Model, model } from "mongoose";
import { IActivity } from "../schema";
import TaskStatus, { ITaskStatus } from "./task.status.schema";
import { IExtendedDocument } from "../../../utilities/methods";
import { IExtendedModel } from "../../../utilities/static";

export interface ITaskGroup extends ITaskStatus {
    _id: Schema.Types.ObjectId;
}

export interface ITaskGroupModel extends Model<ITaskGroup>, IExtendedModel { }

const options = {
    discriminatorKey: "type",
    collection: "activities.classification",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<ITaskGroup>(
    {

    },
    options
);

const TaskGroup: ITaskGroupModel = TaskStatus.discriminator<ITaskGroup, ITaskGroupModel>("TaskGroup", schema);
export default TaskGroup;
