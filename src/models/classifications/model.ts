import Classification from "./schema";
import PriceLevel, { IPriceLevelModel } from "./pricelevel/schema";
import PriceGroup, { IPriceGroupModel } from "./pricegroup/schema";

export default Classification;

interface Types {
    pricelevel: IPriceLevelModel;
    pricegroup: IPriceGroupModel;
}

export const ClassificationTypes: Types = {
    pricelevel: PriceLevel,
    pricegroup: PriceGroup
};