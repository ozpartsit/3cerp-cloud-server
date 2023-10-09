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


}

