import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";


interface IAxis {
    show_grid: boolean;
    show_ticks: boolean;
    show_title: boolean;
    stacked: boolean;
}


export interface IChartTypePreference extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    account: mongoose.Schema.Types.ObjectId;
    type: string;
    chart: string;
    legend: boolean;
    index_axis: boolean;
    x: IAxis;
    y: IAxis;
}


// Schemas ////////////////////////////////////////////////////////////////////////////////
interface IChartTypePreferenceModel extends mongoose.Model<IChartTypePreference>, IExtendedModel<IChartTypePreference> { }

const options = {
    discriminatorKey: "type", collection: "preferences", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<IChartTypePreference>(
    {
        account: { type: mongoose.Schema.Types.ObjectId, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, default: "ChartType" },
        chart: { type: String },
        legend: { type: Boolean },
        index_axis: { type: Boolean },
        x: {


            show_grid: {
                type: Boolean,
                required: true,
                default: true,
            },
            show_ticks: {
                type: Boolean,
                required: true,
                default: true,
            },
            show_title: {
                type: Boolean,
                required: true,
                default: true,
            },
            stacked: {
                type: Boolean,
                required: true,
                default: false,
            },

        },
        y: {


            show_grid: {
                type: Boolean,
                required: true,
                default: true,
            },
            show_ticks: {
                type: Boolean,
                required: true,
                default: true,
            },
            show_title: {
                type: Boolean,
                required: true,
                default: true,
            },
            stacked: {
                type: Boolean,
                required: true,
                default: false,
            },

        },

    },
    options
);


schema.index({ name: 1 });

const ChartType: IChartTypePreferenceModel = mongoose.model<IChartTypePreference, IChartTypePreferenceModel>(
    "ChartType",
    schema
);
export default ChartType;