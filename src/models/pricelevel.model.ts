import { Schema, model, Types } from "mongoose";

export interface IPriceLevel {
    _id: Schema.Types.ObjectId | string;
    name: string;
    type: string;
    base: string;
    percentageChange: number;
}
export const schema = new Schema<IPriceLevel>(
    {
        _id: { type: Schema.Types.Mixed, default: () => new Types.ObjectId() },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ["PriceLevel"],
            default: "PriceLevel"
        },
        base: {
            type: String,
            required: true,
            enum: ["baseprice", "purchaseprice"],
            default: "baseprice"
        },
        percentageChange: {
            type: Number,
            required: true,
            default: 1
        }
    },
    { collection: "pricelevels" }
);
schema.index({ name: 1 });

const PriceLevel = model("PriceLevel", schema);
PriceLevel.init().then(function (Event) {
    const docs = [
        { _id: "baseprice", name: "Base Price" },
        { _id: "customprice", name: "Custom Price" },
    ]
    docs.forEach(doc => {
        let query = { _id: doc._id };
        let options = { upsert: true };
        // Find the document
        PriceLevel.findOneAndUpdate(query, {}, options).catch(err => { console.log(err) });
    })
    console.log('PriceLevel Builded');
})
export default PriceLevel
