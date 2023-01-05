import { Schema, Model, model } from "mongoose";
import { IClassification } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface IPriceLevel extends IClassification {
    _id: Schema.Types.ObjectId 
    name: string;
    type: string;
    base: string;
    percentageChange: number;
}
export interface IPriceLevelModel extends Model<IPriceLevel>, IExtendedModel {}

export const schema = new Schema<IPriceLevel>(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ["PriceLevel"],
            default: "PriceLevel"
        },
        base: {
            type: String,
            required: true,
            default: "baseprice"
        },
        percentageChange: {
            type: Number,
            required: true,
            default: 1
        }
    },
    options
);
schema.index({ name: 1 });

const PriceLevel: IPriceLevelModel = model<IPriceLevel, IPriceLevelModel>(
    "PriceLevel",
    schema
);
export default PriceLevel;