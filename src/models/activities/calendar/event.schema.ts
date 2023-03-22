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
            default: 'event',
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

const Event: IEventModel = model<IEvent, IEventModel>("Event", schema);
export default Event;
