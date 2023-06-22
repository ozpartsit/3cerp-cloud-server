import { Schema } from "mongoose";
import { IAccounting } from "../schema";
export interface IPaymentMethod extends IAccounting {
}

const options = { discriminatorKey: "type", collection: "accounting" };
const schema = new Schema<IPaymentMethod>(
    {

    },
    options
);
export default schema;
