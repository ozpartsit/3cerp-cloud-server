import { Schema, Model, model } from "mongoose";
import Classification, { IClassification } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface IPriceLevel extends IClassification {
    _id: Schema.Types.ObjectId 
    base: string;
    percentageChange: number;
}
export interface IPriceLevelModel extends Model<IPriceLevel>, IExtendedModel<IPriceLevel> {}

export const schema = new Schema<IPriceLevel>(
    {
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

const PriceLevel: IPriceLevelModel = Classification.discriminator<IPriceLevel, IPriceLevelModel>(
    "PriceLevel",
    schema
);
export default PriceLevel;