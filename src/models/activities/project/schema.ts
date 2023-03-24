import { Schema, Model, model } from "mongoose";
import Activity, { IActivity } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import Task, { ITask } from "./task.schema";
import Group, { IGroup } from "./group.schema";
import Tag, { ITag } from "./tag.schema";
export interface IProject extends IActivity {
    tasks: ITask[];
    groups: IGroup[];
    tags: ITag[];
}
export interface IProjectModel extends Model<IProject>, IExtendedModel { }

const options = { discriminatorKey: "type", collection: "activities" };
const schema = new Schema<IProject>({}, options);

schema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: true,
    model: Task
});
schema.virtual("groups", {
    ref: "Group",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: true,
    model: Group
});
schema.virtual("tags", {
    ref: "Tag",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: true,
    model: Tag
});
const Project: IProjectModel = Activity.discriminator<IProject, IProjectModel>(
    "Project",
    schema
);
export default Project;
