import { Schema, Model, model } from "mongoose";
import Activity, { IActivity } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import Task, { ITask } from "./task.schema";

const TaskModel = model("Task", Task);
const options = { discriminatorKey: "type", collection: "activities" };

export interface IProject extends IActivity {
    Tasks: ITask[];
}
export interface IProjectModel extends Model<IProject>, IExtendedModel { }

const schema = new Schema<IProject>({}, options);

schema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: true,
    model: TaskModel
});

const Project: IProjectModel = Activity.discriminator<IProject, IProjectModel>(
    "project",
    schema
);
export default Project;
