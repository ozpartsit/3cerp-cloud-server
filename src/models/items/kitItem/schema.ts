import { Schema, model, Model } from "mongoose";
import Item, { IItem } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import Component, { IComponent } from "./components.schema";
const componentModel = model("Component", Component);
const options = { discriminatorKey: "type", collection: "items" };

export interface IKitItem extends IItem {
  components: IComponent[];
}
export interface IKitItemModel extends Model<IKitItem>, IExtendedModel {}

const schema = new Schema<IKitItem>({}, options);
schema.virtual("components", {
  ref: "Component",
  localField: "_id",
  foreignField: "item",
  justOne: false,
  autopopulate: true,
  model: componentModel
});
// schema.method("getComponents", async function (kitline: any) {
//   await this.populate("components");
//   const components = this.components.map((component: IComponent) => {
//     return {
//       item: component.component,
//       quantity: component.quantity,
//       description: component.description,
//       type: "KitComponent",
//       kit: kitline
//     };
//   });
//   await this.depopulate("components");
//   return components;
// });
schema.method("syncComponents", async function (line: any) {
  let exists = false;
  line.parent.lines.forEach((existline: any) => {
    if (existline.kit && existline.kit.id === line.id) {
      // console.log(existline.multiplyquantity, line.quantity);
      // existline.quantity = existline.multiplyquantity * line.quantity;
      // console.log(existline.quantity, existline.description);
      // existline.description = "sdasd";
      exists = true;
    }
  });
  if (!exists) {
    await this.populate("components");
    for (const [subindex, component] of this.components.entries()) {
      let newline = {
        item: component.component,
        quantity: component.quantity,
        description: component.description,
        multiplyquantity: component.quantity,
        type: "KitComponent",
        kit: line
      };
      if (line.parent.lines) {
        line.parent.addToVirtuals("lines", newline, line.index + 1 + subindex);
      }
    }
    await this.depopulate("components");
  }
});

const KitItem: IKitItemModel = Item.discriminator<IKitItem, IKitItemModel>(
  "KitItem",
  schema
);

export default KitItem;
