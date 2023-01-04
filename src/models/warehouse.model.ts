import { Schema, model } from "mongoose";
//import { Warehouse as warehouseClass } from "../shared/recordtype";
export interface IWarehouse {
  _id: Schema.Types.ObjectId;
  name: string;
  type: string;
}
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
  { collection: "warehouses" }
);
schema.index({ name: 1 });
const Warehouse = model("Warehouse", schema);
Warehouse.init().then(function (Event) {
  console.log('Warehouse Builded');
})
export default Warehouse;

