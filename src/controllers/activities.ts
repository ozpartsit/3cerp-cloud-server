import IActivity, { ActivityTypes } from "../models/activities/model";
import controller from "./controller";

export default class IActivityController extends controller {
    constructor() {
        super({ model: IActivity, submodels: ActivityTypes });
    }
}
