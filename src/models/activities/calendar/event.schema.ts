import { Schema, Model, model } from "mongoose";
import { IActivity } from "../schema";
import { IExtendedDocument } from "../../../utilities/methods";
import { IExtendedModel } from "../../../utilities/static";
export interface IEvent extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    activity: IActivity["_id"];
    description: string;
    name: string;
    date: Date;
    endDate: Date;
    type: string;
    color: string;
}

export interface IEventModel extends Model<IEvent>, IExtendedModel { }

const options = {
    discriminatorKey: "activity",
    collection: "activities.tasks_events",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<IEvent>(
    {
        activity: { type: Schema.Types.ObjectId },
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'Event',
            required: true,
        },
        description: {
            type: String,
            default: ""
        },
        date: { type: Date, input: "date", required: true },
        endDate: { type: Date, input: "date" },
        color: {
            type: String,
            default: "#e1e1e1"
        },
    },
    options
);

const Event: IEventModel = model<IEvent, IEventModel>("Event", schema);
export default Event;
