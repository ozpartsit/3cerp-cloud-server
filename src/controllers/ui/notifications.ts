import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import CustomError from "../../utilities/errors/customError";
import Notification from '../../models/notification.model';
import schedule from 'node-schedule';

export default class NotificationController {

    constructor() {
        // temporary schedule
        const job = schedule.scheduleJob('*/5 * * * *', async function () {

            let Model = Notification.setAccount("64f4cc1c9842bd71489d1fa0");
            const total = await Model.count({ status: "unread" })
                .exec()
            console.log('Temporary Notification Bot', total);
            if (total < 20) {
                new Model({
                    user:'64c3bd50c9de39e62091e373',
                    name: 'New Sales Order!',
                    description: `Sales Order (SO#${Math.floor(Math.random() * 1000)}) Pending Approval`,
                    date: new Date(),
                    document: "63988d8db3ae32a894fd539e",
                    ref: "SalesOrder"
                }).save()
            }
        });
    }

    public async check(req: Request, res: Response, next: NextFunction) {
        // check new
        let Model = Notification.setAccount(req.headers.account, req.headers.user);
        const total = await Model.count({ status: "unread" })
            .exec()

        res.json({ status: "success", data: { total } });
    }

    public async find(req: Request, res: Response, next: NextFunction) {
        // find
        let Model = Notification.setAccount(req.headers.account, req.headers.user);
        const filters: any = { status: { $nin: ["archived"] } };

        if (req.params.status) {
            if (req.params.status === "archived") filters.status = "archived";
            if (["unread", "new"].includes(req.params.status)) filters.status = { $nin: ["archived", "read"] };
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

        let Model = Notification.setAccount(req.headers.account, req.headers.user);
        const document = await Model.findById(req.params.id)
            .populate({ path: 'document', select: 'name' })
            .exec();
        if (document) {
            document.status = "read";
            document.save();
        }
        res.json({ status: "success", data: { document } });

    }
    public async archive(req: Request, res: Response, next: NextFunction) {
        let Model = Notification.setAccount(req.headers.account, req.headers.user);
        if (req.params.id == "all") {
            await Model.updateMany({}, { $set: { status: "archived" } });
        } else {
            const document = await Model.findById(req.params.id)
                .populate({ path: 'document', select: 'name' })
                .exec();
            if (document) {
                document.status = "archived";
                document.save();
            }
            res.json({ status: "success", data: { document } });
        }
    }
    //delete
    public async delete(req: Request, res: Response, next: NextFunction) {
        let Model = Notification.setAccount(req.headers.account, req.headers.user);
        if (req.params.id == "all") {
            await Model.deleteMany({}, { $set: { status: "archived" } });
        } else {
            const document = await Model.findByIdAndDelete(req.params.id).exec();
            res.json({ status: "success", data: { document } });
        }
    }

}

