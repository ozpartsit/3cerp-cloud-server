import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import CustomError from "../../utilities/errors/customError";
import Notification from '../../models/notification.model';

export default class NotificationController {

    constructor() {

    }

    public async check(req: Request, res: Response, next: NextFunction) {
        // check new
        let Model = Notification.setAccount(req.headers.account);
        const total = await Model.count({ read: { $exists: false } })
            .exec()

        res.json({ status: "success", data: { total } });
    }

    public async find(req: Request, res: Response, next: NextFunction) {
        // find
        let Model = Notification.setAccount(req.headers.account);
        const filters: any = { archived: false };

        if (req.params.status) {
            if (req.params.status === "archived") filters.archived = true;
            if (req.params.status === "unread") filters.read = { read: { $exists: false } };
        }
        
        const array = await Model.find(filters)
            .populate({ path: 'document', select: 'name' })
            .exec()
        const total = await Model.count(filters).exec();

        const data = {
            docs: array,
            totalDocs: total,
            limit: 25,
            page: 1,
            totalPages: 1
        }
        res.json({ status: "success", data });

    }
    public async get(req: Request, res: Response, next: NextFunction) {

        let Model = Notification.setAccount(req.headers.account);
        const document = await Model.findById(req.params.id)
        .populate({ path: 'document', select: 'name' })
        .exec();
        if (document) {
            document.read = new Date();
            document.save();
        }
        res.json({ status: "success", data: { document } });

    }
    public async archive(req: Request, res: Response, next: NextFunction) {
        let Model = Notification.setAccount(req.headers.account);
        const document = await Model.findById(req.params.id)
        .populate({ path: 'document', select: 'name' })
        .exec();
        if (document) {
            document.archived = true;
            document.save();
        }
        res.json({ status: "success", data: { document } });

    }
    //search

}

