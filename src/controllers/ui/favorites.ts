import axios from 'axios';
import controller from "../genericController";
import { Request, Response, NextFunction } from 'express';
import { IExtendedModel } from "../../utilities/static";
import { IExtendedDocument } from "../../utilities/methods";
import { IFavorites } from "../../models/favorites/schema";
import { FavoritesTypes } from '../../models/favorites/model';


// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }
export default class FavoritesController<T extends IExtendedDocument & IFavorites> extends controller<T> {

    constructor(model: IModel<T>) {
        super(model);
    }
    public async find(req: Request, res: Response, next: NextFunction) {
        //dla category dodajemy selecty
        let type = this.model.modelName.split("_")[0];
        if (type && type == "FavoriteCategory") req.query.select = "links,links.link"
        await super.find(req, res, next);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        let type = this.model.modelName.split("_")[0];
        if (type && type == "FavoriteLink") {
            let categoryModel = FavoritesTypes.category;
            if (req.body && req.body.document && req.body.document.documentType) {
                let category = await categoryModel.findOne({ name: req.body.document.documentType });
                if (!category) {
                    let object = {
                        name: req.body.document.documentType,
                        account: req.headers.account,
                        user: req.headers.user
                    }

                    let { document, saved } = await categoryModel.addDocument("simple", object);
                    req.body.document.category = document;
                } else {
                    req.body.document.category = category;
                }
                req.body.document.link = req.body.document.link || "tu cos będzie";
                req.body.document.name = req.body.document.name || "tu cos będzie";
            }
        }

        await super.add(req, res, next);
    }

    async get(req: Request, res: Response, next: NextFunction) {
        let { recordtype, id, mode } = req.params;
        let { field } = req.query;

        if (field == "document") {
            const tmp = (err) => {
                res.json({ status: "success", data: { document: false } });
            }
            await super.get(req, res, tmp);
        } else {
            await super.get(req, res, next);
        }
    }
}

