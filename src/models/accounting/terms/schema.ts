import { Schema } from "mongoose";
import { IAccounting } from "../schema";
export interface ITerms extends IAccounting {
}

const options = { discriminatorKey: "type", collection: "accounting" };
const schema = new Schema<ITerms>(
    {

    },
    options
);
export default schema;
