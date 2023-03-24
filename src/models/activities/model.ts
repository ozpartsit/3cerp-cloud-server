import Activity from "./schema";
import Calendar, { ICalendarModel } from "./calendar/schema";
import Event, { IEventModel } from "./calendar/event.schema";
import Project, { IProjectModel } from "./project/schema";
import Task, { ITaskModel } from "./project/task.schema";

export default Activity;

interface Types {
    calendar: ICalendarModel;
    project: IProjectModel;
    event: IEventModel;
    task: ITaskModel;
}

export const ActivityTypes: Types = {
    calendar: Calendar,
    project: Project,
    event: Event,
    task: Task,
};
