import * as mongoose from "mongoose";
import Accounting, { IAccounting } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
const options = { discriminatorKey: "type", collection: "classifications" };

export interface IPaymentMethod extends IAccounting {

}
export interface IPaymentMethodModel extends mongoose.Model<IPaymentMethod>, IExtendedModel<IPaymentMethod> { }

export const schema = new mongoose.Schema<IPaymentMethod>(
    {},
    options
);
schema.index({ name: 1 });

const PaymentMethod: IPaymentMethodModel = Accounting.discriminator<IPaymentMethod, IPaymentMethodModel>(
    "PaymentMethod",
    schema
);
export default PaymentMethod;