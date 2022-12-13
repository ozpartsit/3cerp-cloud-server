import { Schema, Model, Document } from "mongoose";
import { cache } from "../app";
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
  await document.autoPopulate();
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
      await document.autoPopulate();
  } else {
    document = await this.loadDocument(id);
    if (document)
      await document.autoPopulate();
  }
  return document;
}

export async function saveDocument(this: any, id: string) {
  let document = cache.getCache(id);
  await document.save();
  cache.delCache(id);
  return id;
}

export async function updateDocument(this: any, id: string, list: string, subrecord: string, field: string, value: any) {
  let document = cache.getCache(id);
  await document.setValue(list, subrecord, field, value);
  let msg = await document.recalcRecord();
  await document.autoPopulate();
  return { document, msg };
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

  let { limit, select, sort } = options;
  let result = await this.find(query).sort(sort).limit(limit).select(select);
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

}
export interface IExtendedModel {
  loadDocument(id: string): any;
  addDocument(data: Object): any;
  getDocument(id: string, mode: string): any;
  saveDocument(id: string): any;
  updateDocument(id: string, list: string, subrecord: string, field: string, value: any): any;
  deleteDocument(id: string): any;
  findDocuments(query: Object, options: any): any;
}
