import controller from "./genericController";
import { Request, Response, NextFunction } from "express";
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import { ITransaction } from "../models/transactions/schema";
import CustomError from "../utilities/errors/customError";
// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }
export default class TransactionController<T extends IExtendedDocument & ITransaction> extends controller<T> {
  constructor(model: IModel<T>) {
    super(model);
  }
  public async pdf(req: Request, res: Response, next: NextFunction) {
    try {
      let { recordtype, id } = req.params;
      let document = await this.model.getDocument(id, 'view');
      if (document) {
        let pdf = await document.pdf();

        res.contentType('application/pdf;charset=UTF-8');
        res.send(pdf)
      } else {
        throw new CustomError("doc_not_found", 404);
      }
    } catch (error) {
      return next(error);
    }
  }
}
