import controller from "./genericController";
import { Request, Response, NextFunction } from "express";
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import CustomError from "../utilities/errors/customError";
// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }
export default class TransactionController<T extends IExtendedDocument> extends controller<T> {
    constructor(model: IModel<T>) {
        super(model);
    }
    async get(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode } = req.params;
        let { field } = req.query;
        try {
            //this.model = this.model.setAccount(req.headers.account, req.headers.user);
            let document = await this.model.getDocument(id, mode, true, (field || "_id").toString());
            if (!document) {
                field = (field || "").toString();
                if (["table", "dashboard", "chart"].includes(field)) {
                    let prefObj = { user: req.headers.user, account: req.headers.account }
                    prefObj[field] = id.toString()
                    await new this.model(prefObj).save();
                    this.get(req, res, next)
                } else {
                    throw new CustomError("doc_not_found", 404);
                }



            } else {
                //populate response document
                await document.autoPopulate();
                let docObject = document.constantTranslate(req.locale);
                res.json({ status: "success", data: { document: docObject, mode: mode === "advanced" ? mode : "simple" } });


            }
        } catch (error) {
            return next(error);
        }
    }
    public async update(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode } = req.params;
        let { field } = req.query;
        let document = await this.model.getDocument(id, mode, true, (field || "_id").toString());
        if (!document) {
            field = (field || "").toString();
            if (["table", "dashboard", "chart"].includes(field)) {
                let prefObj = { user: req.headers.user, account: req.headers.account }
                prefObj[field] = id.toString()
                await new this.model(prefObj).save();
                this.update(req, res, next)
            } else {
                throw new CustomError("doc_not_found", 404);
            }

            super.update(req, res, next);
        } else {
            super.update(req, res, next);
        }
    }

    public async save(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode } = req.params;
        let { field } = req.query;
        let document = await this.model.getDocument(id, mode, true, (field || "_id").toString());

        if (!document) {
            field = (field || "").toString();
            if (["table", "dashboard", "chart"].includes(field)) {
                let prefObj = { user: req.headers.user, account: req.headers.account }
                prefObj[field] = id.toString()
                await new this.model(prefObj).save();
                this.save(req, res, next)
            } else {
                throw new CustomError("doc_not_found", 404);
            }
        } else {
            super.save(req, res, next);
        }
    }
}