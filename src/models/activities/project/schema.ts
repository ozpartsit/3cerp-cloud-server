import { Schema, Model, model } from "mongoose";
import Activity, { IActivity } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import Task, { ITask } from "./task.schema";
import TaskGroup, { ITaskGroup } from "./task.group.schema";
import TaskTag, { ITaskTag } from "./task.tag.schema";
export interface IProject extends IActivity {
    tasks: ITask[];
    groups: ITaskGroup[];
    tags: ITaskTag[];
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
    model: Task,
    options: { sort: { index: 1 } },
});
schema.virtual("groups", {
    ref: "TaskGroup",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: { select: "name displayname color" },
    model: TaskGroup,
    options: { sort: { index: 1 } },
});
schema.virtual("tags", {
    ref: "TaskTag",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: { select: "name displayname color" },
    model: TaskTag
});
const Project: IProjectModel = Activity.discriminator<IProject, IProjectModel>(
    "Project",
    schema
);
export default Project;
