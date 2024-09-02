import { IKitItem } from "../items/kitItem/schema.js";
import { ILine } from "./line.schema.js";

export async function setItem(line: ILine) {
  if (line.item) {
    await line.populate("item");
    //fill fields
    line.description = line.item.description || "";
    line.price = await line.item.getPrice();
    // kitItem
    if (line.item && line.item.type === "KitItem") {
      if ('syncComponents' in line.item) await line.item.syncComponents(line);
    }
    line.depopulate();
  }
}
export async function setQuantity(line: any) {
  console.log("setVaule_quantity")
  if (line.item && line.item.type === "KitItem") {
    await line.item.syncComponents(line);
  }
}

