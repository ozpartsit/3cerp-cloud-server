import { models } from "mongoose";
export default async function setValue(
  this: any,
  list: string,
  subrecord: string,
  field: string,
  value: any
) {
  try {
    console.log("setValue", field, list);
    let changeLogs = this.getChanges();
    if (list) {

      let SubDocument = this[list].find((element: any) => {
        return element._id.toString() === subrecord;
      });

      if (SubDocument) {
        SubDocument[field] = value;
      } else {
        let virtual: any = this.schema.virtuals[list];
        if (field) {
          SubDocument = new models[virtual.options.ref]();

          SubDocument[field] = value;
          this[list].push(SubDocument);
        } else console.log("The list does not exist");
      }
      // to do - dodać do virtual option parametr uniq/incrrepemt dla indexa (sort)
      // if (field === "index") {
      //   this[list].sort((a: any, b: any) => a.index - b.index)
      // }
      //await SubDocument.validate();
      changeLogs[list] = SubDocument.getChanges();
    } else {
      this[field] = value;
      await this.populate(field, "name displayname type _id");
      changeLogs = this.getChanges();
    }
    await this.validate();
  } catch (err) {
    return err;
  }

}
