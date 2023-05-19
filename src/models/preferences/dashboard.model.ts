import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../../utilities/methods";
import { IExtendedModel } from "../../utilities/static";
export interface IDashboard extends IExtendedDocument {
    entity: Schema.Types.ObjectId;
    type: string;
    dashboard: string;
    widgets: any[]
}
interface IDashboardModel extends Model<IDashboard>, IExtendedModel { }

export const schema = new Schema<IDashboard>(
    {

        type: {
            type: String,
            required: true,
            default: "dashboard"
        },
        dashboard: {
            type: String,
            required: true,
        },
        entity: {
            type: Schema.Types.ObjectId,
            ref: "Entity"
        },
        widgets: {
            type: []
        }
    },
    {
        collection: "settings",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


schema.index({ name: 1 });

const Dashboard: IDashboardModel = model<IDashboard, IDashboardModel>("Dashboard", schema);
export default Dashboard;

