import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
import Chart from "./chartPreference.model.js";
import Table from "./tablePreference.model.js";

interface IWidget {
    id: string;
    size: string;
    name: string;
    type: string;
    preference: mongoose.Schema.Types.ObjectId;
}




export interface IDashboardPreference extends IExtendedDocument {
    user: mongoose.Schema.Types.ObjectId;
    account: mongoose.Schema.Types.ObjectId;
    dashboard: string;
    type: string;
    widgets: [IWidget];

}


// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IDashboardPreferenceModel extends mongoose.Model<IDashboardPreference>, IExtendedModel<IDashboardPreference> { }

const options = {
    discriminatorKey: "type", collection: "preferences", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IDashboardPreference>(
    {
        account: { type: mongoose.Schema.Types.ObjectId, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, default: "Dashboard" },
        dashboard: { type: String },
        widgets: [
            {
                id: {
                    type: String,
                },
                name: {
                    type: String,
                },
                type: {
                    type: String,
                },
                size: {
                    type: String,
                },
                preference: {
                    type: mongoose.Schema.Types.ObjectId,
                },
            }
        ],

    },
    options
);


schema.index({ name: 1 });

schema.pre("save", async function (next) {
    for (let widget of this.widgets) {
        if (widget.type) {
            if (!widget.id) widget.id = `${widget.type}_${Date.now()}`
            let pref;
            if (['bar', 'line', 'pie'].includes(widget.type)) pref = await Chart.findOne({ chart: widget.id })
            if (widget.type == "table") pref = await Table.findOne({ table: widget.id })

            // if (widget.type == "Calendar") pref = Calendar.find({ calendar: widget._id })   
            if (pref) widget.preference = pref._id
        }
    }
    next();
});


const Dashboard: IDashboardPreferenceModel = mongoose.model<IDashboardPreference, IDashboardPreferenceModel>(
    "Dashboard",
    schema
);
export default Dashboard;
