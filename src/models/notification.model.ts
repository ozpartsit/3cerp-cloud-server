import { Schema, model, Model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";


export interface INotification extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    account: Schema.Types.ObjectId;
    type: string;
    name: string;
    description: string;
    date: Date;
    read: Date;
    archived: boolean;
    link: string;
    document: Schema.Types.ObjectId;
    ref: string;
}



// Schemas ////////////////////////////////////////////////////////////////////////////////
interface INotificationModel extends Model<INotification>, IExtendedModel<INotification> { }

const options = {
    discriminatorKey: "type", collection: "notifications", toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
const schema = new Schema<INotification>(
    {
        account: { type: Schema.Types.ObjectId, required: true },
        user: { type: Schema.Types.ObjectId },
        name: { type: String, default: "New Notification", required: true },
        description: { type: String, default: "New Botification", required: true },
        date: { type: Date, default: new Date(), required: true },
        read: { type: Date },
        link: { type: String },
        archived: { type: Boolean, default: false },
        document: {
            refPath: 'ref',
            autopopulate: true,
            type: Schema.Types.Mixed,
        },
        ref: {
            type: String,
        },
    },
    options
);



schema.index({ name: 1 });

const Notification: INotificationModel = model<INotification, INotificationModel>(
    "Notification",
    schema
);
export default Notification;
