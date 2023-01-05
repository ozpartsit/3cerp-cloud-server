import { Schema } from "mongoose";
import { IEntity } from "./schema";
import { schema as PriceLevel, IPriceLevel } from "../classifications/pricelevel/schema";
export interface IGroupLevel {
    _id: Schema.Types.ObjectId;
    entity: IEntity["_id"];
    priceGroup: string;
    priceLevel: IPriceLevel["_id"];
    moq: number;
}
const options = {
    discriminatorKey: "entity",
    collection: "entities.grouplevels"
};
const schema = new Schema<IGroupLevel>(
    {
        entity: { type: Schema.Types.ObjectId },
        priceGroup: { type: String, required: true },
        priceLevel: { type: PriceLevel, ref: "PriceLevel", required: true },
        moq: { type: Number, required: true, default: 1 },
    },
    options
);

export default schema;
