import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";


export interface INotification extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    account: mongoose.Schema.Types.ObjectId;
    type: string;
    name: string;
    description: string;
    date: Date;
    status: string;
    link: string;
    document: mongoose.Schema.Types.ObjectId;
    ref: string;
}



// Schemas ////////////////////////////////////////////////////////////////////////////////
interface INotificationModel extends mongoose.Model<INotification>, IExtendedModel<INotification> { }

const options = {
    discriminatorKey: "type", collection: "notifications", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new mongoose.Schema<INotification>(
    {
        account: { type: mongoose.Schema.Types.ObjectId, required: true },
        user: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String, default: "New Notification", required: true },
        description: { type: String, default: "New Botification", required: true },
        date: { type: Date, default: new Date(), required: true },
        link: { type: String },
        status: { type: String, default: "unread" },
        document: {
            refPath: 'ref',
            autopopulate: true,
            type: mongoose.Schema.Types.Mixed,
        },
        ref: {
            type: String,
        },
    },
    options
);



schema.index({ name: 1 });

const Notification: INotificationModel = mongoose.model<INotification, INotificationModel>(
    "notification",
    schema
);
Notification.init().then(function (Event) {
    console.log('Notification Builded');
})

export default Notification;
