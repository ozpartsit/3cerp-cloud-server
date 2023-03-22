import Item, { ItemTypes } from "../models/items/model";
import controller from "./controller";
import { Request, Response, NextFunction } from "express";
export default class ItemController extends controller {
  constructor() {
    super({ model: Item, submodels: ItemTypes });
  }

  // helper overwite function
  // public async find(req: Request, res: Response, next: NextFunction) {
  //   let statuses = ["DBA", "ACS", "ACL", "HAWK", "PEDDERS"];
   
  //   let items = await Item.find();
  //   console.log(items[0])
  //   for (let item of items) {
  //     let status = statuses[Math.floor(Math.random() * 5)];
  //     let res = await item.updateOne({ $set: { manufacturer: status } });
  //     console.log(res)
  //   }
  // }
}
