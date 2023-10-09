import Favorites from "./schema";
import FavoriteLink, { ILinkModel } from "./link/schema";
import FavoriteCategory, { ICategoryModel } from "./category/schema";

export default Favorites;

interface Types {
    link: ILinkModel;
    category: ICategoryModel;
}

export const FavoritesTypes: Types = {
    link: FavoriteLink,
    category: FavoriteCategory
};