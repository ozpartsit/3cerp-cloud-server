import { Schema, Model, Document } from "mongoose";
import { cache, email } from "../app";
import getFields from "./staticts/getFields";
import pdf from "./pdf/pdf"
//loadDocument
export async function loadDocument(this: any, id: string) {
  let doc = await this.findOne({ _id: id });
  if (doc) {
    await doc.virtualPopulate();
    await doc.validateVirtuals();

    return doc;
  } else return null;
}

//API
export async function addDocument(this: any, data: Object) {
  let document = new this(data);
  document.initLocal();
  await document.recalcDocument();
  let msg = await document.validateDocument();
  // insert document to cache
  cache.addCache(document);
  return { document, msg };
}

export async function getDocument(this: any, id: string, mode: string) {
  //let document = cache.getCache(id);
  //if (!document) {
  let document = await this.loadDocument(id);
  //}
  if (document) {
    if (mode === "edit") cache.addCache(document);
  }
  return document;
}

export async function saveDocument(this: any, id: string) {
  let document = cache.getCache(id);
  if (document) {
    await document.saveDocument();
    pdf();
    return id;
  } else {
    // to do - dodać error
  }

}

interface updateBody {
  list: string,
  subrecord: string,
  field: string,
  value: any,

}

export async function updateDocument(this: any, id: string, updates: updateBody | updateBody[]) {
  let document = cache.getCache(id);
  let save = false;
  if (!document) {
    document = await this.loadDocument(id);
    save = true;
  }
  let msg = [];
  if (!Array.isArray(updates)) updates = [updates]; // array
  for (let update of updates) {
    msg = await document.setValue(update.field, update.value, update.list, update.subrecord);
  }

  if (save) {
    document = await document.saveDocument();
    return { document, msg };
  } else {
    await document.recalcDocument();
    return { document, msg };
  }
}

export async function deleteDocument(this: any, id: string) {
  let document = await this.loadDocument(id);
  if (document) {
    document.deleted = true;
    await document.recalcDocument();
    cache.delCache(id);
    document.remove();
  } else {
    // to do - dodać error
  }

  return id;
}

export async function findDocuments(this: any, query: Object, options: any) {
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


export default function staticsMethods(schema: any, options: any) {
  schema.statics.loadDocument = loadDocument;
  schema.statics.addDocument = addDocument;
  schema.statics.getDocument = getDocument;
  schema.statics.saveDocument = saveDocument;
  schema.statics.updateDocument = updateDocument;
  schema.statics.deleteDocument = deleteDocument;
  schema.statics.findDocuments = findDocuments;

  schema.statics.getFields = getFields;
}
export interface IExtendedModel {
  loadDocument(id: string): any;
  addDocument(data: Object): any;
  getDocument(id: string, mode: string): any;
  saveDocument(id: string): any;
  updateDocument(id: string, list: string, subrecord: string, field: string, value: any): any;
  deleteDocument(id: string): any;
  findDocuments(query: Object, options: any): any;

  getFields(): any;
}
