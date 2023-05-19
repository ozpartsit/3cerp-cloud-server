import { Schema, Model, model } from "mongoose";
import { IActivity } from "../schema";
import TaskStatus, { ITaskStatus } from "./class.schema";
import { IExtendedDocument } from "../../../utilities/methods";
import { IExtendedModel } from "../../../utilities/static";

export interface IGroup extends ITaskStatus {

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

    },
    options
);

const Group: IGroupModel = TaskStatus.discriminator<IGroup, IGroupModel>("Group", schema);
export default Group;
