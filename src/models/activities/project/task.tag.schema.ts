import { Schema, Model, model } from "mongoose";
import TaskStatus, { ITaskStatus } from "./task.status.schema";
import { IExtendedDocument } from "../../../utilities/methods";
import { IExtendedModel } from "../../../utilities/static";

export interface ITaskTag extends ITaskStatus { }

export interface ITaskTagModel extends Model<ITaskTag>, IExtendedModel { }

const options = {
    discriminatorKey: "type",
    collection: "activities.classification",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<ITaskTag>({}, options);

const TaskTag: ITaskTagModel = TaskStatus.discriminator<ITaskTag, ITaskTagModel>("TaskTag", schema);
export default TaskTag;
