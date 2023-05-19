import { Schema, Model, model } from "mongoose";
import { IItem } from "./schema";
import { IExtendedModel } from "../../utilities/static";
import { IExtendedDocument } from "../../utilities/methods";
import { schema as PriceLevel, IPriceLevel } from "../classifications/pricelevel/schema";
import Currencies from "../../constants/currencies";
const options = { discriminatorKey: "type", foreignField: "item", collection: "items.price" };

export interface IPrice extends IExtendedDocument {
    item: IItem["_id"];
    currency: string;
    price: number;
    moq: number;
    priceLevel: IPriceLevel;
}
export interface IPriceModel extends Model<IPrice>, IExtendedModel { }

const schema = new Schema<IPrice>({
    item: {
        type: Schema.Types.ObjectId,
        ref: "Item"
    },
    price: { type: Number, default: 0, required: true },
    moq: { type: Number, default: 1, required: true },
    currency: {
        type: String,
        enum: Currencies,
        required: true,
        resource: 'constants',
        constant: 'currencies'
    },
    priceLevel: {
        type: Schema.Types.ObjectId,
        ref: "Classification",
        autopopulate: true,
        required: false,
    }

}, options);

const Price: IPriceModel = model<IPrice, IPriceModel>(
    "Price",
    schema
);
export default Price;
