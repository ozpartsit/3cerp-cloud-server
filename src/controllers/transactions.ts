import Transaction, { TransactionTypes } from "../models/transactions/model";
import controller from "./controller";
import { Request, Response, NextFunction } from "express";
export default class TransactionController extends controller {
  constructor() {
    super({ model: Transaction, submodels: TransactionTypes });
  }
  public async pdf(req: Request, res: Response, next: NextFunction) {
    let { recordtype, id } = req.params;
    const model = this.setModel(recordtype);
    let document = await model.getDocument(id, 'view');
    let pdf = await document.pdf();

    res.contentType('application/pdf;charset=UTF-8');
    res.send(pdf)
  }
}
