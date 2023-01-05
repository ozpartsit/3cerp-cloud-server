import { Schema, Model, model } from "mongoose";
import { IClassification } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface IPriceGroup extends IClassification {
    _id: Schema.Types.ObjectId,
    name: string
}
export interface IPriceGroupModel extends Model<IPriceGroup>, IExtendedModel {}

export const schema = new Schema<IPriceGroup>(
    {
        name: {
            type: String,
            required: true
        }
    },
    options
);
schema.index({ name: 1 });

const PriceGroup: IPriceGroupModel = model<IPriceGroup, IPriceGroupModel>(
    "PriceGroup",
    schema
);
export default PriceGroup;