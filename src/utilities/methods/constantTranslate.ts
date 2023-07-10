import i18n from "../../config/i18n";
export default function constantTranslate(this: any, local: string) {

    let doc = this.toObject();

    // Virtuals
    const virtuals: any[] = Object.values(this.schema.virtuals);
    for (let list of virtuals) {
        if (list.options.ref && list.options.autopopulate) {
            if (Array.isArray(this[list.path])) {
                for (let index in doc[list.path]) {
                    doc[list.path][index] = this[list.path][index].constantTranslate(local);
                    console.log(doc[list.path][index])
                }

            }
        }
    }

    this.schema.eachPath(function process(pathname: string, schemaType: any) {
        i18n.setLocale(local || "en");
        //constats
        if (schemaType.options.constant && doc[pathname]) {
            doc[pathname] = { _id: doc[pathname], name: i18n.__(doc[pathname]) };
        }
    });
    return doc;
}