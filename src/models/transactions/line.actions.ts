import { models } from "mongoose";
import { IKitItem } from "../items/kitItem/schema";
import { ILine } from "./line.schema";

const actions: any = {
  item: async (line: any) => {
    if (line.item) {
      await line.populate("item");
      //fill fields
      line.description = line.item.description || "";
      line.price = await line.item.getPrice(line);
      // kitItem
      if (line.item.type === "KitItem") {
        await line.item.syncComponents(line);
      }
      line.depopulate("item");
    }
  },
  quantity: async (line: any) => {
    if (line.item.type === "KitItem") {
      await line.item.syncComponents(line);
    }
  }
};
export default actions;
