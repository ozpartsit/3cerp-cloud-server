import Transaction, { TransactionTypes } from "../models/transactions/model";
import controller from "./controller";

export default class TransactionController extends controller {
  constructor() {
    super({ model: Transaction, submodels: TransactionTypes });
  }
}
