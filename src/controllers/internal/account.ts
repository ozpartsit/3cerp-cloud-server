import axios from 'axios';
import controller from "../genericController";
import { Request, Response, NextFunction } from 'express';
import { IExtendedModel } from "../../utilities/static";
import { IExtendedDocument } from "../../utilities/methods";
import { INote } from "../../models/note.model";
import { ICustomer } from '../../models/entities/customer/schema.js';
import CustomError from "../../utilities/errors/customError";
import Shop, { IShop } from "../../models/ecommerce/shop.model.js"
import Entity from '../../models/entities/schema.js';
import mongoose from 'mongoose';
import cache from "../../config/cache";

// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }

export default class WebsiteController<T extends IExtendedDocument & ICustomer> extends controller<T> {
    constructor(model: IModel<T>) {
        super(model);
    }

    async getAccount(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        try {
            if (req.cookies.user || id) {
                id = id || req.cookies.user;
            }
            if (id) {
                let document = await this.model.getDocument(id || req.cookies.user, "simple", true, "_id");
                if (document) {
                    //populate response document
                    await document.autoPopulate();
                    let docObject = document.constantTranslate(req.locale, true);
                    res.json({ status: "success", data: { document: docObject } });
                }
            
            } else throw new CustomError("account_not_found", 404)


        } catch (error) {
            return next(error);
        }

    }
    async updateAccount(req: Request, res: Response, next: NextFunction) {

        let { id } = req.params;
        try {
            if (req.cookies.user || id) {
                id = id || req.cookies.user;
            }
            if (id) {
                let { document, subdocument } = await this.model.updateDocument(id, "simple", "_id", req.body);
                res.json({ status: "success", data: { document: document, subdocument: subdocument }, message: "account_updated" });
            } else throw new CustomError("account_not_found", 404)


        } catch (error) {
            return next(error);
        }
    }

    async accountOptions(req: Request, res: Response, next: NextFunction) {

        let { id } = req.params;
        try {
            req.params.mode = "simple"

            if (req.cookies.user || id) {
                req.params.id = id || req.cookies.user;
            }
            if (!req.params.id) throw new CustomError("doc_not_found", 404);

            this.options(req, res, next)

        } catch (error) {
            return next(error);
        }
    }
}

