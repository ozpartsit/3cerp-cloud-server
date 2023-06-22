import { model } from "mongoose";

import Accounting from "./schema";
import Terms from "./terms/schema";
import PaymentMethod from "./paymentmethod/schema";

export default Accounting;

// interface Types {
//     terms: ITermsModel;
//     paymentmethod: IPaymentMethodModel;
// }

export const AccountingTypes = {
    terms: Accounting.discriminator("Terms", Terms),
    paymentmethod: Accounting.discriminator("PaymentMethod", PaymentMethod),
};
