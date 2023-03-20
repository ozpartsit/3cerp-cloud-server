import { Schema, model } from "mongoose";
export interface IShop {
    _id: Schema.Types.ObjectId;
    name: string;
    subdomain: string;
    template: string;
    type: string;
}
export const schema = new Schema<IShop>(
    {
        name: {
            type: String,
            required: true,
            min: [3, "Must be at least 3 characters long, got {VALUE}"]
        },
        subdomain: {
            type: String,
            required: true,
            min: [3, "Must be at least 3 characters long, got {VALUE}"]
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
            enum: ["default"],
            default: "default"
        }
    },
    { collection: "webisites" }
);
schema.index({ name: 1 });
const Shop = model("Shop", schema);

export default Shop;

