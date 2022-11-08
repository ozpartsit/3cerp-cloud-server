import Warehouse from "../models/warehouse.model";
import controller from "./controller";

export default class WarehouseController extends controller {
    constructor() {
        super({ model: Warehouse, submodels: {} });
    }
}
