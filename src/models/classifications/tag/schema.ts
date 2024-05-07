import { Schema, Model, model } from "mongoose";
import Classification, { IClassification } from "../schema";
import { IExtendedModel } from "../../../utilities/static";
import Account from "../../account.model"
const options = { discriminatorKey: "type", collection: "classifications" };

export interface ITag extends IClassification {
    color: string;
}
export interface ITagModel extends Model<ITag>, IExtendedModel<ITag> { }

export const schema = new Schema<ITag>(
    {
        color: { type: String, input: "Input", validType: "colorPicker", defaultSelect: true },
    },
    options
);
//schema.index({ name: 1 });

const Tag: ITagModel = Classification.discriminator<ITag, ITagModel>(
    "Tag",
    schema
);
Tag.init().then(async function (Event) {
    console.log('Tag Builded');
    //predefinowanie
    Account.find({}).then(async (res) => {
        for (let account of res) {
            const tags = await Tag.countDocuments({ account: account._id });
            if (!tags) {
                for (let tag of ["Priority", "Important", "Calm", "Comments"]) {
                    new Tag({ name: tag, account: account._id }).save()
                }
            }

        }
    })


})
export default Tag;