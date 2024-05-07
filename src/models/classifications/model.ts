import Classification from "./schema";
import PriceLevel, { IPriceLevelModel } from "./pricelevel/schema";
import PriceGroup, { IPriceGroupModel } from "./pricegroup/schema";
import Group, { IGroupModel } from "./group/schema";
import Category, { ICategoryModel } from "./category/schema";
import Tag, { ITagModel } from "./tag/schema";
export default Classification;

interface Types {
    pricelevel: IPriceLevelModel;
    pricegroup: IPriceGroupModel;
    group: IGroupModel;
    category: ICategoryModel;
    tag: ITagModel;
}

export const ClassificationTypes: Types = {
    pricelevel: PriceLevel,
    pricegroup: PriceGroup,
    group: Group,
    category: Category,
    tag: Tag
};