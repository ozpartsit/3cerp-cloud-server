import * as mongoose from "mongoose";
import Classification, { IClassification } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface IPriceGroup extends IClassification {
    _id: mongoose.Schema.Types.ObjectId,
    name: string
}
export interface IPriceGroupModel extends mongoose.Model<IPriceGroup>, IExtendedModel<IPriceGroup> {}

export const schema = new mongoose.Schema<IPriceGroup>(
    {
        name: {
            type: String,
            required: true,
            input: "text"
        }
    },
    options
);
schema.index({ name: 1 });

const PriceGroup: IPriceGroupModel = Classification.discriminator<IPriceGroup, IPriceGroupModel>(
    "PriceGroup",
    schema
);
export default PriceGroup;