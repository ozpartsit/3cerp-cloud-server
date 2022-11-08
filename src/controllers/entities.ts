import Entity, { EntityTypes } from "../models/entities/model";
import controller from "./controller";

export default class EntityController extends controller {
  constructor() {
    super({ model: Entity, submodels: EntityTypes });
  }
}
