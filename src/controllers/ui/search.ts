import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import CustomError from "../../utilities/errors/customError";
import Notification from '../../models/notification.model';
import Transaction from '../../models/transactions/schema';
import Item from '../../models/items/schema';
import i18n from '../../config/i18n';

export default class NotificationController {

    constructor() {

    }
    public async scope(req: Request, res: Response, next: NextFunction) {
        const scopes = [
            'salesorder',
            'invoice',
            'customers',
            'ventors',
            'invitems',
            'kititem'
        ]
        i18n.setLocale(req.locale || "en");
        let results = scopes.map(s => {
            return { name: i18n.__(`scope.${s}`), _id: s }
        })

        const data = {
            docs: results,
        }
        res.json({ status: "success", data });
    }
    public async find(req: Request, res: Response, next: NextFunction) {

        const results: any = [];
        let total = 0;
        // find

        // transactions
        let Model = Transaction.setAccount(req.headers.account);
        const filters: any = { inactived: false };

        let array = await Model.find(filters)
            .populate({ path: 'entity', select: 'name' })
            .select({ name: 1, type: 1, entity: 1, date: 1 })
            .exec()

        array.forEach((e: any) => {
            results.push({
                _id: e._id,
                name: e.name,
                description: `${i18n.__(`type.${e.type}`)} ${e.entity ? "(" + e.entity.name + ")" : ""}`,
                date: e.date ? new Date(e.date).toISOString().substr(0, 10) : null,
                type: e.type,
                resource: e.resource
            })
        })


        total += await Model.count(filters).exec();


        const data = {
            docs: results,
            totalDocs: total,
            limit: 25,
            page: 1,
            totalPages: 1
        }
        res.json({ status: "success", data });

    }


}

