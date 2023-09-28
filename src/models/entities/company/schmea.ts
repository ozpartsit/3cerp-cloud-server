import { Schema, Model } from "mongoose";
import Entity, { IEntity } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
export interface ICompany extends IEntity {

}

export interface ICompanyModel extends Model<ICompany>, IExtendedModel<ICompany> { }

const options = { discriminatorKey: "type", collection: "entities" };
const schema = new Schema<ICompany>(
    {

    },
    options
);


const Company: ICompanyModel = Entity.discriminator<
    ICompany,
    ICompanyModel
>("Company", schema);
export default Company;