import Accounting from "./schema";
import PaymentMethod, { IPaymentMethodModel } from "./paymentmethod/schema";
import Terms, { ITermsModel } from "./terms/schema";
export default Accounting;

interface Types {
    paymentmethod: IPaymentMethodModel;
    category: ITermsModel;
}

export const AccountingTypes: Types = {
    paymentmethod: PaymentMethod,
    category: Terms
};