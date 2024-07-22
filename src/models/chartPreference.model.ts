
import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
import Dashboard from "./dashboardPreference.model.js";



export interface IChartPreference extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    account: mongoose.Schema.Types.ObjectId;
    chart: string;
    type: string;
    source: string;
    field: string;
    value: string;
    daterange: string;
    intervals: string;

}


// Schemas ////////////////////////////////////////////////////////////////////////////////
export interface IChartPreferenceModel extends mongoose.Model<IChartPreference>, IExtendedModel<IChartPreference> { }

const options = {
    discriminatorKey: "type", collection: "preferences", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IChartPreference>(
    {
        account: { type: mongoose.Schema.Types.ObjectId, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: {
            type: String,
            required: true,
            default: "Chart"

        },
        chart: {
            type: String,
            required: true,

        },
        source: {
            type: String,
            required: true,
            input: "Select", constant: 'chartsource'
        },
        field: {
            type: String,
            required: true,
            default: 'data',
            input: "Select",
            constant: 'chartfield'
        },
        value: {
            type: String,
            required: true,
            default: 'amount',
            input: "Select",
            constant: 'chartvalue'
        },
        daterange: { type: String, required: true, default: '$thisYear', input: "Select", constant: 'datarange' },
        intervals: { type: String, required: true, default: '$quarterly', input: "Select", constant: 'interval' },

    },
    options
);


schema.index({ name: 1 });

schema.post("save", async function () {
    let dashboards = await Dashboard.find({ type: "Dashboard" });

    for (let dashboard of dashboards) {
        dashboard.save()
    }
});


const Chart: IChartPreferenceModel = mongoose.model<IChartPreference, IChartPreferenceModel>(
    "Chart",
    schema
);
export default Chart;
