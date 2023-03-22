import { Schema, Model, model } from "mongoose";
import Activity, { IActivity } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import Event, { IEvent, IEventModel } from "./event.schema";

const options = { discriminatorKey: "type", collection: "activities" };

export interface ICalendar extends IActivity {
    events: IEvent[];
}
export interface ICalendarModel extends Model<ICalendar>, IExtendedModel { }

const schema = new Schema<ICalendar>({}, options);

schema.virtual("events", {
    ref: "Event",
    localField: "_id",
    foreignField: "activity",
    justOne: false,
    autopopulate: true,
    model: Event
});

const Calendar: ICalendarModel = Activity.discriminator<ICalendar, ICalendarModel>(
    "Calendar",
    schema
);
export default Calendar;
