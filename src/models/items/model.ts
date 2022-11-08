import Item from "./schema";
import InvItem, { IInvItemModel } from "./invItem/schema";
import KitItem, { IKitItemModel } from "./kitItem/schema";
import Service, { IServiceModel } from "./service/schema";

export default Item;

interface Types {
  invitem: IInvItemModel;
  kititem: IKitItemModel;
  service: IServiceModel;
}

export const ItemTypes: Types = {
  invitem: InvItem,
  kititem: KitItem,
  service: Service
};
