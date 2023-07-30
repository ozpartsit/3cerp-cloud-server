import { Schema, Model, Document } from "mongoose";
import cache from "../config/cache";
import getFields from "./staticts/getFields";
import getForm from "./staticts/getForm";
import { IExtendedDocument } from "../utilities/methods";

// interfejs rozszeżający model o uniwersalne metody
export interface IExtendedModel<T extends Document> extends Model<T> {
  loadDocument: (id: string) => Promise<T | null>;
  addDocument: (data: Object) => any;
  getDocument: (id: string, mode: string) => Promise<T | null>;
  saveDocument: (id: string) => Promise<string | null>;
  updateDocument: (id: string, updates: updateBody) => any;
  deleteDocument: (id: string) => any;
  findDocuments: (query: Object, options: any) => any;

  getFields(locale?: string): any;
  getForm(locale: string): any;
}

export default function customStaticsMethods<T extends IExtendedDocument>(schema: Schema<T, IExtendedModel<T>>) {
  schema.statics.loadDocument = loadDocument;
  schema.statics.getDocument = getDocument;
  schema.statics.saveDocument = saveDocument;
  schema.statics.updateDocument = updateDocument;
  schema.statics.deleteDocument = deleteDocument;
  schema.statics.findDocuments = findDocuments;

  schema.statics.getFields = getFields;
  schema.statics.getForm = getForm;
}

//loadDocument
export async function loadDocument<T extends IExtendedDocument>(this: Model<T>, id: string): Promise<T | null> {
  let doc = await this.findById(id);

  if (doc) {
    await doc.virtualPopulate();
    await doc.validateVirtuals(false);
    return doc;
  } else return null;
}

//API
export async function addDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, data: Object) {
  let document = await this.create(data);
  document.initLocal();
  document.recalcDocument();
  let msg = await document.validateDocument();
  // Zapisanie dokumentu do cache
  cache.set(document._id, document);
  return { document, msg };
}

export async function getDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, id: string, mode: string): Promise<T | null> {
  //if (!document) {
  let document: T | null = await this.loadDocument(id);
  //}
  if (document && document._id) {
    if (mode === "edit") cache.set(id, document);
  }
  return document;
}

// zapisuje dokument
// najpierw sprawdza czy jest w cachu
// jeżeli tak, zapisuje aktyywny stan i zwraca identyfikator
// jeżeli nie, zwraca null
export async function saveDocument<T extends IExtendedDocument>(this: Model<T>, id: string): Promise<string | null> {
  let document = cache.get<T>(id);
  if (document) {
    await document.saveDocument();
    return id;
  } else {
    return null;
  }

}

interface updateBody {
  list: string,
  subrecord: string,
  field: string,
  value: any,

}

export async function updateDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, id: string, updates: updateBody | updateBody[]) {
  let document = cache.get<T | null>(id);
  let save = false;
  if (!document) {
    document = await this.loadDocument(id);
    save = true;
  }
  if (document) {
    let msg: any = [];
    if (!Array.isArray(updates)) updates = [updates]; // array
    for (let update of updates) {
      msg = await document.setValue(update.field, update.value, update.list, update.subrecord);
    }



    if (save) {
      document = await document.saveDocument();
      return { document, msg, saved: true };
    } else {
      await document.recalcDocument();
      return { document, msg, saved: false };
    }
  }
}

export async function deleteDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, id: string) {
  let document = await this.loadDocument(id);
  if (document) {
    document.deleted = true;
    document.recalcDocument();
    cache.del(id);
    document.remove();
  } else {
    // to do - dodać error
  }

  return id;
}

export async function findDocuments<T extends IExtendedDocument>(this: IExtendedModel<T>, query: any, options: any) {
  let docFields = this.getFields();
  let { limit, select, sort, skip } = options;
  let populated: any = {};
  for (const [key, value] of Object.entries(select)) {
    // to do - poprawić
    let fieldsSelect = { name: 1, resource: 1, type: 1 };
    let fields = key.split('.');
    if (fields.length > 1) {
      if (populated[fields[0]]) {
        populated[fields[0]].select[fields[1]] = 1;
        populated[fields[0]].populate.push({
          path: fields[1],
          select: 'name resource type'
        })
      } else {
        fieldsSelect[fields[1]] = 1;
        populated[fields[0]] = {
          path: fields[0],
          select: fieldsSelect,
          populate: [{
            path: fields[1],
            select: 'name resource type'
          }]
        }
      }
      delete select[key];
    } else {
      let field = docFields.find((field: any) => field.field == fields[0]);
      if (field && field.ref) {
        if (!populated[fields[0]]) {
          populated[fields[0]] = {
            path: fields[0],
            select: field.selects || fieldsSelect
          }
        }
      }
    }
  }


  let result = await this.find(query)
    .populate(Object.values(populated))
    .sort(sort).skip(skip).limit(limit).select(select);

  return result;
}




