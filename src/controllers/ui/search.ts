import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import CustomError from "../../utilities/errors/customError";
import Notification from '../../models/notification.model';
import Transaction from '../../models/transactions/schema';
import Item from '../../models/items/schema';

export default class NotificationController {

    constructor() {

    }
    public async scope(req: Request, res: Response, next: NextFunction) {
        let results = [
            { name: "Sales Orders", _id: 'salesorder' },
            { name: "Invoices", _id: 'invoice' },
            { name: "Customers", _id: 'customers' },
            { name: "Vendors", _id: 'ventors' },
            { name: "Inventory Items", _id: 'invitems' },
            { name: "Kit Items", _id: 'kititem' },
        ]
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
            .select({ name: 1, entity: 1 })
            .exec()

        if (array.length) results.push(...array)
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

