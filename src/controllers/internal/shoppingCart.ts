import axios from 'axios';
import controller from "../genericController";
import { Request, Response, NextFunction } from 'express';
import { IExtendedModel } from "../../utilities/static";
import { IExtendedDocument } from "../../utilities/methods";
import { INote } from "../../models/note.model";
import { ISalesOrder } from '../../models/transactions/salesOrder/schema.js';
import CustomError from "../../utilities/errors/customError";
import { IShop } from "../../models/ecommerce/shop.model.js"
import Entity from '../../models/entities/schema.js';
import mongoose from 'mongoose';
import cache from "../../config/cache";

// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }

export default class WebsiteController<T extends IExtendedDocument & ISalesOrder> extends controller<T> {
    constructor(model: IModel<T>) {
        super(model);
    }

    async getShoppingCart(req: Request, res: Response, next: NextFunction) {
        let { id } = req.params;
        try {
            if (!req.cookies.shoppingcart && !id) {
                if (!req.body.document) req.body.document = {}
                req.body.document.account = req.headers.account; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
                if (this.model.userRequired() && false) req.body.document.user = req.headers.user;

                // zalogowany user
                req.body.document.entity = req.cookies.user;

                let { document, saved } = await this.model.addDocument("advanced", req.body.document);
                // filter deleted
                res.cookie('shoppingcart', document._id, { maxAge: 900000, httpOnly: true });

                //populate response document
                await document.autoPopulate();

                let docObject = document.constantTranslate(req.locale, true);

                res.json({ status: "success", data: { document: docObject, mode: "advanced" } });
            } else {
                let document = await this.model.getDocument(id || req.cookies.shoppingcart, "advanced", true, "_id");
                console.log(document)
                if (!document) {
                    req.cookies.shoppingcart = "";
                    this.getShoppingCart(req, res, next)
                } else {

                    // zalogowany user
                    if (!document.entity && req.cookies.user) {
                        document.setValue("entity", req.cookies.user, null, null, null, null)
                    }



                    //populate response document
                    await document.autoPopulate();
                    let docObject = document.constantTranslate(req.locale, true);
                    res.json({ status: "success", data: { document: docObject, mode: "advanced" } });
                }
            }
        } catch (error) {
            return next(error);
        }

    }
    async addToShoppingCart(req: Request, res: Response, next: NextFunction) {

        let { id } = req.params;


        try {
            let document = await this.model.getDocument(id || req.cookies.shoppingcart, "advanced", true, "_id");
            req.params.mode = "advanced"

            if (document) {
                req.params.id = document._id.toString();
            } else {
                if (!req.body.document) req.body.document = {}
                req.body.document.account = req.headers.account; // to do - przypisanie ownerAccount dla każdego nowego dokumentu
                if (this.model.userRequired() && false) req.body.document.user = req.headers.user;
                let { document, saved } = await this.model.addDocument("advanced", req.body.document);

                res.cookie('shoppingcart', document._id, { maxAge: 900000, httpOnly: true });
                req.params.id = document._id.toString();
            }
            if (!req.body.item || req.body.value) throw new CustomError("Item is Required", 500);
            req.body = [
                { subdoc: "lines", field: "item", value: req.body.item || req.body.value },
                { subdoc: "lines", field: "quantity", value: req.body.quantity || 1 }
            ]

            this.update(req, res, next)


        } catch (error) {
            return next(error);
        }
    }
    async updateShoppingCart(req: Request, res: Response, next: NextFunction) {

        let { id } = req.params;

        try {
            if (req.cookies.shoppingcart || id) {
                req.params.mode = "advanced"
                req.params.id = id || req.cookies.shoppingcart;
            }
            this.update(req, res, next)

        } catch (error) {
            return next(error);
        }
    }
    async shoppingCartOptions(req: Request, res: Response, next: NextFunction) {

        let { id } = req.params;
        try {
            req.params.mode = "advanced"

            if (req.body.field == "addresses") {
                const shoppingCart = cache.get<T>(id || req.cookies.shoppingcart)
                this.model = mongoose.model("Entity") as IExtendedModel<T>;
                if (shoppingCart) {
                    req.params.mode = "simple"
                    id = "657ffb20c2868bb8094b3e3a"//shoppingCart.entity.toString()
                } else {
                    throw new CustomError("doc_not_found", 404);
                }

            }

            if (req.cookies.shoppingcart || id) {
                req.params.id = id || req.cookies.shoppingcart;
            }
            this.options(req, res, next)
            this.model = mongoose.model("shoppingcart") as IExtendedModel<T>;

        } catch (error) {
            return next(error);
        }
    }
}

