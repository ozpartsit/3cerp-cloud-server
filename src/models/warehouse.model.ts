import { Schema, Model, model } from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
//import { Warehouse as warehouseClass } from "../shared/recordtype";
export interface IWarehouse extends IExtendedDocument {
  _id: Schema.Types.ObjectId;
  name: string;
  type: string;
}

interface IWarehouseModel extends Model<IWarehouse>, IExtendedModel { }

export const schema = new Schema<IWarehouse>(
  {
    name: {
      type: String,
      required: true,
      min: [2, "Must be at least 2 characters long, got {VALUE}"]
    },
    type: {
      type: String,
      required: true,
      enum: ["warehouse"],
      default: "warehouse"
    }
  },
  {
    collection: "warehouses",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
schema.index({ name: 1 });

const Warehouse: IWarehouseModel = model<IWarehouse, IWarehouseModel>("Warehouse", schema);
Warehouse.init().then(function (Event) {
  console.log('Warehouse Builded');
})
export default Warehouse;

