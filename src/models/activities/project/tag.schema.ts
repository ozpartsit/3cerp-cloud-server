import { Schema, Model, model } from "mongoose";
import TaskStatus, { ITaskStatus } from "./class.schema";
import { IExtendedDocument } from "../../../utilities/methods";
import { IExtendedModel } from "../../../utilities/static";

export interface ITag extends ITaskStatus { }

export interface ITagModel extends Model<ITag>, IExtendedModel { }

const options = {
    discriminatorKey: "type",
    collection: "activities.classification",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<ITag>({}, options);

const Tag: ITagModel = TaskStatus.discriminator<ITag, ITagModel>("Tag", schema);
export default Tag;
