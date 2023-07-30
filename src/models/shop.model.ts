import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
export interface IShop extends IExtendedDocument {
    _id: Schema.Types.ObjectId;
    name: string;
    subdomain: string;
    template: string;
    type: string;
    status: string;
    domain: string;
}
export interface IShopModel extends Model<IShop>, IExtendedModel<IShop> { }

export const schema = new Schema<IShop>(
    {
        name: {
            type: String,
            required: true,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "text"
        },
        subdomain: {
            type: String,
            required: true,
            min: [3, "Must be at least 3 characters long, got {VALUE}"],
            input: "text"
        },
        type: {
            type: String,
            required: true,
            enum: ["webshop"],
            default: "webshop"
        },
        template: {
            type: String,
            required: true,
            default: "default",
            input: "text"
        },
        status: {
            type: String,
            required: true,
            enum: ["online", "offline"],
            default: "offline"
        },
        domain: {
            type: String,
            input: "text"
        }
    },
    {
        collection: "websites",
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
schema.virtual('url').get(function (this: any) {
    return `https://${this.subdomain}.3cerp.cloud`;
});

schema.index({ name: 1 });

const Shop: IShopModel = model<IShop, IShopModel>("Shop", schema);
export default Shop;

