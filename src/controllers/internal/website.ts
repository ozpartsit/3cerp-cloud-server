import axios from 'axios';
import controller from "../genericController";
import { Request, Response, NextFunction } from 'express';
import { IExtendedModel } from "../../utilities/static";
import { IExtendedDocument } from "../../utilities/methods";
import { INote } from "../../models/note.model";

import CustomError from "../../utilities/errors/customError";
import Shop, { IShop } from "../../models/ecommerce/shop.model.js"
import Entity from '../../models/entities/schema.js';
import mongoose from 'mongoose';
import cache from "../../config/cache";
import Customer from '../../models/entities/customer/schema.js';

// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }

export default class WebsiteController<T extends IExtendedDocument & IShop> extends controller<T> {
    constructor(model: IModel<T>) {
        super(model);
    }
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body.email) {
                let Entity = mongoose.model("customer");
                const customer = await Entity.findOne({ email: req.body.email }, { password: true })
                if (customer) {
                    let correct = await customer.validatePassword(req.body.password);
                    if (correct) {
                        res.cookie('user', customer._id, { maxAge: 900000, httpOnly: true });
                        res.json({ status: "success", data: { user: customer }, message: "login_success" });
                    } else {
                        throw new CustomError("wrong_password", 500);
                    }
                } else {
                    throw new CustomError("email_not_found", 404);
                }


            } else throw new CustomError("doc_not_found", 404);

        } catch (error) {
            return next(error);
        }
    }
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body.email) {
                let Entity = mongoose.model("customer");
                const customer = await Entity.findOne({ email: req.body.email }, { _id: true })
                if (customer) {
                    let shop = await Shop.getDocument(req.body.pointer || req.subdomains[0], "simple", true, "subdomain")
                    if (shop) {
                        // tworzenie lead lub contact form
                        await shop.sendEmail("reset_password", req.locale, req.body.email, customer)
                        res.json({ status: "success", data: { user: customer._id }, message: "form_sent" });
                    }
                } else {
                    throw new CustomError("email_not_found", 404);
                }
            } else throw new CustomError("doc_not_found", 404);

        } catch (error) {
            return next(error);
        }
    }
    async updatePassword(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body.password && req.params.id) {
                let Entity = mongoose.model("customer");
                const customer = await Entity.findById(req.params.id, { _id: true })
                if (customer) {
                    let shop = await Shop.getDocument(req.body.pointer || req.subdomains[0], "simple", true, "subdomain")
                    if (shop) {
                        customer.password = req.body.password;
                        await customer.save()
                        res.json({ status: "success", message: "password_updated" });
                    }
                } else {
                    throw new CustomError("email_not_found", 404);
                }


            } else throw new CustomError("doc_not_found", 404);

        } catch (error) {
            return next(error);
        }
    }
    async contact(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body) {
                let shop = await Shop.getDocument(req.body.pointer || req.subdomains[0], "simple", true, "subdomain")

                if (shop) {
                    // tworzenie lead lub contact form

                    await shop.sendEmail("contact", req.locale, req.body.email, req.body)
                    res.json({ status: "success", data: req.body, message: "form_sent" });
                }


            } else throw new CustomError("form_is_empty", 500);

        } catch (error) {
            return next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body) {
                let shop = await Shop.getDocument(req.body.pointer || req.subdomains[0], "simple", true, "subdomain")

                if (shop) {
                    // tworzenie customera
                    let document = {

                        firstName: (req.body.firstName || "").trim(),
                        lastName: (req.body.lastName || "").trim(),
                        name: (req.body.name || "").trim() || (`${req.body.firstName} ${req.body.lastName}`).trim(),
                        email: (req.body.email || "").trim(),
                        password: (req.body.password || "").trim(),
                        account: shop.account,

                    }
                    const customer = new Customer(document);
                    await customer.save()
                    await shop.sendEmail("registration", req.locale, req.body.email, customer)
                    res.json({ status: "success", data: { user: customer._id }, message: "form_sent" });
                }

            } else throw new CustomError("form_is_empty", 500);

        } catch (error) {
            return next(error);
        }
    }

}

