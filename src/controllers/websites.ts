import Website from "../models/shop.model";
import controller from "./controller";

export default class WebsiteController extends controller {
    constructor() {
        super({ model: Website, submodels: {} });
    }
    
}
