import { Schema, Model, Document } from "mongoose";
import { cache, email } from "../app";
import getFields from "./staticts/getFields";
import pdf from "./pdf/pdf"
//loadDocument
export async function loadDocument(this: any, id: string) {
  let doc = await this.findOne({ _id: id });

  if (doc) {
    await doc.virtualPopulate();
    return doc;
  } else return null;
}

//API
export async function addDocument(this: any, data: Object) {
  let document = new this(data);
  await document.recalcRecord();
  let msg = await document.validateSync();
  // insert document to cache
  cache.addCache(document);
  document = await document.autoPopulate();
  return { document, msg };
}

export async function getDocument(this: any, id: string, mode: string) {
  let document = cache.getCache(id);
  if (mode === "edit") {
    if (!document) {
      document = await this.loadDocument(id);
      cache.addCache(document);
    }
    if (document)
      document = await document.autoPopulate();
  } else {
    document = await this.loadDocument(id);
    if (document)
      document = await document.autoPopulate();
  }
  return document;
}

export async function saveDocument(this: any, id: string) {
  let document = cache.getCache(id);
  await document.save();
  cache.delCache(id);
  //email.send({}, {}, 'ts');
  pdf();
  return id;
}

interface updateBody {
  list: string,
  subrecord: string,
  field: string,
  value: any,

}

export async function updateDocument(this: any, id: string, updates: updateBody | updateBody[], save: Boolean) {
  let document = cache.getCache(id);
  if (!document) document = await this.getDocument(id, "edit");
  if (!Array.isArray(updates)) updates = [updates]; // array
  for (let update of updates) {
    await document.setValue(update.list, update.subrecord, update.field, update.value);
  }
  let msg = await document.recalcRecord();
  if (save) {
    document = await this.saveDocument(id);
    return { document, msg };
  } else {
    document = await document.autoPopulate();
    return { document, msg };
  }
}

export async function deleteDocument(this: any, id: string) {
  let document = cache.getCache(id);
  document.deleted = true;
  await document.recalcRecord();
  cache.delCache(id);
  document.remove();

  return id;
}

export async function findDocuments(this: any, query: Object, options: any) {

  let { limit, select, sort, skip } = options;
  let populated: any = null;
  // for (const [key, value] of Object.entries(select)) {
  //   // to do - poprawić
  //   let fields = key.split('.');
  //   if (fields.length > 1) {
  //     let fieldsSelect = { name: 1 };
  //     fieldsSelect[fields[1]] = 1;
  //     populated = {
  //       path: fields[0],
  //       select: fieldsSelect,
  //       populate: {
  //         path: fields[1],
  //         select: 'name resource type'
  //       }
  //     }
  //     delete select[key];
  //   }
  // }
  //console.log(select)


  let result = await this.find(query)
    .populate(populated)
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
