import { Schema } from "mongoose";
import { IActivity } from "../schema";
export interface ITask {
    _id: Schema.Types.ObjectId;
    activity: IActivity["_id"];
    name: string;
    description: string;
    date: Date;
    endDate: Date;
}

const options = {
    discriminatorKey: "activity",
    collection: "activities.tasks_events"
};
const schema = new Schema<ITask>(
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
        date: { type: Date, input: "date", required: true },
        endDate: { type: Date, input: "date" },
    },
    options
);

export default schema;
