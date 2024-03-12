import axios from 'axios';
import controller from "../genericController";
import { Request, Response, NextFunction } from 'express';
import { IExtendedModel } from "../../utilities/static";
import { IExtendedDocument } from "../../utilities/methods";
import { IFavorites } from "../../models/favorites/schema";


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

}

