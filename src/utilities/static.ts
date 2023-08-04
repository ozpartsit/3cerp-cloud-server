import { Schema, Model, Document, Types } from "mongoose";
import cache from "../config/cache";
import getFields from "./staticts/getFields";
import getForm from "./staticts/getForm";
import { IExtendedDocument } from "../utilities/methods";

// interfejs rozszeżający model o uniwersalne metody
export interface IExtendedModel<T extends Document> extends Model<T> {
  loadDocument: (id: string) => Promise<T | null>;
  addDocument: (mode: string, data: Object) => any;
  getDocument: (id: string, mode: string) => Promise<T | null>;
  saveDocument: (id: string) => Promise<any>;
  updateDocument: (id: string, mode: string, updates: updateBody) => any;
  deleteDocument: (id: string) => any;
  findDocuments: (query: Object, options: any) => any;

  getFields(locale?: string): any;
  getForm(locale: string): any;
}

export default function customStaticsMethods<T extends IExtendedDocument>(schema: Schema<T, IExtendedModel<T>>) {
  schema.statics.loadDocument = loadDocument;
  schema.statics.addDocument = addDocument;
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
  try {
    let doc = await this.findById(id);
    if (doc) {
      await doc.virtualPopulate();
      await doc.validateVirtuals(false);
      return doc;
    } else return null;
  } catch (error) {
    throw error;
  }
}

//API
export async function addDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, mode: string, data: Object) {
  try {
    let document = await this.create(data);
    document.initLocal();
    document.recalcDocument();
    let msg = await document.validateDocument();
    if (mode === "advanced") {
      // Zapisanie dokumentu do cache
      cache.set(document._id, document);
      return { document, msg, saved: false };
    } else {
      await document.saveDocument();
      return { document, msg, saved: true };
    }
  } catch (error) {
    throw error;
  }

}

export async function getDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, id: string, mode: string): Promise<T | null> {
  try {
    let document: T | null = await this.loadDocument(id);
    if (document && document._id) {
      const cacheID = new Types.ObjectId().toString();
      if (mode === "advanced") cache.set(cacheID, document);
    }
    return document;
  } catch (error) {
    throw error;
  }
}

// zapisuje dokument
// najpierw sprawdza czy jest w cachu
// jeżeli tak, zapisuje aktyywny stan i zwraca identyfikator
// jeżeli nie, zwraca null
export async function saveDocument<T extends IExtendedDocument>(this: Model<T>, id: string): Promise<any> {
  try {
    let document = cache.get<T>(id);
    if (document) {
      await document.saveDocument();
      return { document_id: id, saved: true };
    } else {
      return { document_id: null, saved: false };
    }
  } catch (error) {
    throw error;
  }
}

interface updateBody {
  list: string,
  subrecord: string,
  field: string,
  value: any,

}

export async function updateDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, id: string, mode: string, updates: updateBody | updateBody[]) {
  try {
    let document: T | null | undefined = null;
    if (mode === "advanced") {
      document = cache.get<T | null>(id);
    } else {
      document = await this.loadDocument(id);
    }

    if (document) {
      let msg: any = [];
      if (!Array.isArray(updates)) updates = [updates]; // array
      for (let update of updates) {
        msg = await document.setValue(update.field, update.value, update.list, update.subrecord);
      }

      if (mode === "advanced") {
        document.recalcDocument();
        return { document, msg, saved: false };

      } else {
        await document.saveDocument();
        return { document, msg, saved: true };
      }
    } else return { document: null, msg: "error", saved: false };
  } catch (error) {
    throw error;
  }
}

export async function deleteDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, id: string) {
  try {
    let document = await this.loadDocument(id);
    if (document) {
      document.deleted = true;
      document.recalcDocument();
      cache.del(id);
      await document.remove();
      return { saved: true };
    } else {
      return { saved: false };
    }
  } catch (error) {
    throw error;
  }
}

export async function findDocuments<T extends IExtendedDocument>(this: IExtendedModel<T>, query: any, options: any) {
  try {
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
  } catch (error) {
    throw error;
  }
}




