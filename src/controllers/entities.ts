import Entity, { EntityTypes } from "../models/entities/model";
import controller from "./controller";
import { Request, Response, NextFunction } from "express";
export default class EntityController extends controller {
  constructor() {
    super({ model: Entity, submodels: EntityTypes });
  }

  // helper overwite function
  // public async find(req: Request, res: Response, next: NextFunction) {
  //   let statuses = ["active", "inactive", "new", "hold"];

  //   let items = await Entity.find();
  //   console.log(items[0])
  //   for (let item of items) {
  //     let status = statuses[Math.floor(Math.random() * 4)];
  //     let res = await item.updateOne({ $set: { status: status } });
  //     console.log(res)
  //   }
  // }
}
