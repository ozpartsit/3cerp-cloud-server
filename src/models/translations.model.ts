import * as mongoose from "mongoose";
import { IExtendedDocument } from "../utilities/methods";
import { IExtendedModel } from "../utilities/static";
//import { Translation as TranslationClass } from "../shared/recordtype";
export interface ITranslation extends IExtendedDocument {
    _id: mongoose.Schema.Types.ObjectId;
    document: mongoose.Schema.Types.ObjectId;
    type: string;
    field: string;
    language: string;
    value: string;
    ref: string

}

interface ITranslationModel extends mongoose.Model<ITranslation>, IExtendedModel<ITranslation> { }

export const schema = new mongoose.Schema<ITranslation>(
    {
        document: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        type: {
            type: String,
            required: true,
            default: "Translation"
        },
        field: {
            type: String,
            //input: "Select",
            input: "Input",
            validType: "text",
            required: true,
        },
        language: {
            type: String,
            default: "en",
            input: "Select",
            constant: 'language',
            defaultSelect: true,
    
        },
        value: {
            type: String,
            input: "Input",
            validType: "text",
            required: true,
        },

        ref: {
            type: String,
        },

    },
    {
        collection: "translations",
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    }
);
schema.index({ document: 1 });

const Translation: ITranslationModel = mongoose.model<ITranslation, ITranslationModel>("Translation", schema);
Translation.init().then(function (Event) {
    console.log('Translation Builded');
})
export default Translation;

