import { Document, Model } from 'mongoose';
import controller from "./genericController";
import { Request, Response, NextFunction } from "express";
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import { ITransaction } from "../models/transactions/schema";
// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }
export default class TransactionController<T extends IExtendedDocument & ITransaction> extends controller<T> {
  constructor(model: IModel<T>) {
    super(model);
  }
  public async pdf(req: Request, res: Response, next: NextFunction) {
    let { recordtype, id } = req.params;
    let document = await this.model.getDocument(id, 'view');
    if (document) {
      let pdf = await document.pdf();

      res.contentType('application/pdf;charset=UTF-8');
      res.send(pdf)
    } else {
      res.status(404).json(
        {
          error: {
            code: "doc_not_found",
            message: req.__('doc_not_found')
          }
        }
      )
    }
  }
}
