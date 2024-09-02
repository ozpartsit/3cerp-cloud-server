import * as mongoose from "mongoose";
import Item, { IItem } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import { IEntity } from "../../entities/schema";
import Currencies from "../../../constants/currencies";
import form from "./form"

const options = { discriminatorKey: "type", collection: "items" };

// interface IWarehouses {
//   warehouse: IWarehouse["_id"];
//   quantityOnHand?: number;
//   quantityAvailable?: number;
// }
// interface ILocations {
//   warehouse: IWarehouse["_id"];
//   quantityOnHand?: number;
//   quantityAvailable?: number;
//   location: string;
//   preferred: boolean;
// }
// interface IVendors {
//   entity: IEntity["_id"];
//   currency: string;
//   price: number;
//   moq: number;
//   mpn?: string;
//   preferred: boolean;
// }
// const Warehouses = new Schema<IWarehouses>({
//   warehouse: {
//     type: Schema.Types.ObjectId,
//     ref: "Warehouse",
//     required: true,
//     autopopulate: { select: "name displayname type _id" }
//   },
//   quantityOnHand: { type: Number, default: 0 },
//   quantityAvailable: { type: Number, default: 0 }
// });
// const Locations = new Schema<ILocations>({
//   warehouse: {
//     type: Schema.Types.ObjectId,
//     ref: "Warehouse",
//     required: true,
//     autopopulate: { select: "name displayname type _id" }
//   },
//   quantityOnHand: { type: Number, default: 0 },
//   quantityAvailable: { type: Number, default: 0 },
//   location: { type: String, required: true, input: "text" },
//   preferred: { type: Boolean, required: true, input: "boolean" }
// });
// const Vendors = new Schema<IVendors>({
//   entity: {
//     type: Schema.Types.ObjectId,
//     ref: "Entity",
//     required: true,
//     autopopulate: { select: "name displayname type _id" }
//   },
//   price: { type: Number, default: 0, required: true, input: "currency" },
//   moq: { type: Number, default: 1, required: true, input: "integer" },
//   currency: {
//     type: String,
//     //get: (v: any) => Currencies.getName(v),
//     enum: Currencies,
//     required: true,
//     input: "select"
//   },
//   mpn: { type: String, input: "text" },
//   preferred: { type: Boolean, required: true, input: "boolean" }
// });
export interface IInvItem extends IItem {
  sku: string;
  //vendors?: IVendors[];
  //warehouses?: IWarehouses[];
  //locations?: ILocations[];

  //statistics
  firstReceiptDate?: Date;
  lastReceiptDate?: Date;
  firstOrderDate?: Date;
  lastOrderDate?: Date;
  firstPurchaseDate?: Date;
  lastPurchaseDate?: Date;
}
export interface IInvItemModel extends mongoose.Model<IInvItem>, IExtendedModel<IInvItem> { }

const schema = new mongoose.Schema<IInvItem>(
  {
    sku: { type: String, input: "Input", validType: "text" },
    //statistics
    firstReceiptDate: { type: Date },
    lastReceiptDate: { type: Date },
    firstOrderDate: { type: Date },
    lastOrderDate: { type: Date },
    firstPurchaseDate: { type: Date },
    lastPurchaseDate: { type: Date },
    // vendors: {
    //   type: [Vendors],
    //   validate: [
    //     {
    //       validator: (lines: any[]) => lines.length < 50,
    //       msg: "Must have maximum 50 vendors"
    //     }
    //   ]
    // },
    // warehouses: {
    //   type: [Warehouses],
    //   validate: [
    //     {
    //       validator: (lines: any[]) => lines.length < 10,
    //       msg: "Must have maximum 10 warehouses"
    //     }
    //   ]
    // },
    // locations: {
    //   type: [Locations],
    //   validate: [
    //     {
    //       validator: (lines: any[]) => lines.length < 10,
    //       msg: "Must have maximum 10 locations"
    //     }
    //   ]
    // }
  },
  options
);

schema.static("form", () => form)

const InvItem: IInvItemModel = Item.discriminator<IInvItem, IInvItemModel>(
  "InvItem",
  schema
);

export default InvItem;
