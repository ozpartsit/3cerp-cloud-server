import Classification, { ClassificationTypes } from "../models/classifications/model";
import controller from "./controller";

export default class ClassificationController extends controller {
    constructor() {
        super({ model: Classification, submodels: ClassificationTypes });
    }
}
