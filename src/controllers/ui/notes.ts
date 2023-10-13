import axios from 'axios';
import controller from "../genericController";
import { Request, Response, NextFunction } from 'express';
import { IExtendedModel } from "../../utilities/static";
import { IExtendedDocument } from "../../utilities/methods";
import { INote } from "../../models/note.model";


// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }
export default class NotesController<T extends IExtendedDocument & INote> extends controller<T> {

    constructor(model: IModel<T>) {
        super(model);
    }


}

