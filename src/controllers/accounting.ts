import IAccounting, { AccountingTypes } from "../models/accounting/model";
import controller from "./controller";

export default class IAccountingController extends controller {
    constructor() {
        super({ model: IAccounting, submodels: AccountingTypes });
    }
}
