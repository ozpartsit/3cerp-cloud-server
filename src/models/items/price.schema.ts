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
export interface IPriceModel extends Model<IPrice>, IExtendedModel<IPrice> { }

const schema = new Schema<IPrice>({
    item: {
        type: Schema.Types.ObjectId,
        ref: "Item"
    },
    price: {
        type: Number,
        default: 0,
        required: true,
        input: "Input",
        validType: "currency"
    },
    moq: {
        type: Number,
        default: 1,
        required: true,
        input: "Input",
        validType: "number",
        precision: 0
    },
    currency: {
        type: String,
        required: true,
        default: "PLN",
        input: "Select",
        constant: 'currency',
        defaultSelect: true
    },
    priceLevel: {
        type: Schema.Types.ObjectId,
        ref: "Classification",
        autopopulate: true,
        required: false,
        input: "Select",
        validType: "select"
    },

}, options);

const Price: IPriceModel = model<IPrice, IPriceModel>(
    "Price",
    schema
);
export default Price;
