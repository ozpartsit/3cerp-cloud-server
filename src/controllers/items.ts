import Item, { ItemTypes } from "../models/items/model";
import controller from "./controller";

export default class ItemController extends controller {
  constructor() {
    super({ model: Item, submodels: ItemTypes });
  }
}
