import { Schema, Model, Document, Types, model, models } from "mongoose";
import cache from "../config/cache";
import getFields from "./staticts/getFields";
import getForm from "./staticts/getForm";
import getSelect from "./staticts/getSelect";
import { IExtendedDocument } from "../utilities/methods";
import Account from "../models/account.model";


// interfejs rozszeżający model o uniwersalne metody
export interface IExtendedModel<T extends Document> extends Model<T> {
  account: Schema.Types.ObjectId;
  type: string;
  $locals: { triggers: any[] }
  urlComponent?: string;
  uniqNumber?: number;
  deleted?: Boolean

  // deletedDate?: Date;
  options: any;
  loadDocument: (id: string, field?: string) => Promise<T | null>;
  addDocument: (mode: string, data: Object) => any;
  getDocument: (id: string, mode: string, field?: string) => Promise<T | null>;
  saveDocument: (id: string, data: Object) => Promise<any>;
  updateDocument: (id: string, mode: string, field: string, updates: updateBody | updateBody[]) => any;
  getOptions: (id: string, mode: string, field: any, page: number, keyword: string) => Promise<any>;
  deleteDocument: (id: string) => any;
  findDocuments: (query: Object, options: any) => any;

  getFields(locale?: string): any;
  getForm(locale: string): any;
  getSelect(): any;

  setAccount(account: string | string[] | undefined, user?: string | string[] | undefined): this;
  getAccount(): any
  getUser(): any

  form(): any;
  defaultDocument(id: string): any
}

export default function customStaticsMethods<T extends IExtendedDocument>(schema: Schema<T, IExtendedModel<T>>) {
  schema.set('timestamps', true);

  const options = (schema as any).options;
  // to do - poprwić by ni ekorzystać z any
  if (options.collection) {
    let account = new Schema({
      account: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      type: {
        type: String
      },
      urlComponent: {
        type: String
      },
      uniqNumber: {
        type: Number
      },
      deleted: {
        type: Boolean
      }
    })
    schema.add(account);
    schema.index({ account: 1 });

    schema.statics.loadDocument = loadDocument;
    schema.statics.addDocument = addDocument;
    schema.statics.getDocument = getDocument;
    schema.statics.saveDocument = saveDocument;
    schema.statics.updateDocument = updateDocument;
    schema.statics.getOptions = getOptions;
    schema.statics.deleteDocument = deleteDocument;
    schema.statics.findDocuments = findDocuments;

    schema.statics.getFields = getFields;

    schema.statics.getSelect = getSelect;
    schema.statics.setAccount = setAccount;
    schema.statics.getForm = getForm;
  }
}


//setCollection

function setAccount<T extends IExtendedDocument>(this: Model<T>, account: Schema.Types.ObjectId, user?: Schema.Types.ObjectId): Model<IExtendedDocument> {
  if (account) {
    // ustaw bazowy model
    let baseModel = this.modelName.split("_")[0];
    if (this.modelName == ((`${baseModel}_${account}_${user}`).toString())) {
      return models[`${this.modelName}`]
    }
    if (models[`${baseModel}_${account}_${user}`]) {
      return models[`${baseModel}_${account}_${user}`]
    }
    else {
      let filters: any = { account: account };
      // ustawienie dla każdego dokumentu domyślnego account;
      let defaultAccount = new Schema({
        account: {
          type: Schema.Types.ObjectId,
          required: true,
          default: account
        }
      })
      this.schema.add(defaultAccount);

      // ustawienie domyśłnego User na podstawie req
      // jeżeli schemat zawiera user
      if (this.schema.paths.user && user) {
        let defaultUser = new Schema({
          user: {
            type: Schema.Types.ObjectId,
            required: true,
            default: user
          }
        })
        this.schema.add(defaultUser);
        filters.user = user;
      }


      // Dodaanie filtrów do wszytstkich queries
      this.schema.pre("find", function () {
        this.where(filters);
      })
      // wczesniej count teraz countDocuments
      this.schema.pre("countDocuments", function (next) {
        this.where(filters);
        next(); // Kontynuuje do wykonania właściwej operacji countDocuments
      })
      this.schema.pre('findOne', function () {
        this.where(filters);
      });

      // weryfikowanie poprawności account
      // this.schema.pre("save", function () {
      //   if (this.account.toString() !== account.toString()) throw "wrong account";
      // })
      this.schema.static('getAccount', () => account);
      this.schema.static('getUser', () => user);

      
      return model<IExtendedDocument>(`${baseModel}_${account}_${user}`, new Schema(this.schema), this.collection.collectionName);
    }
  } else {
    throw "account is requred"
  }
}

//loadDocuments
export async function loadDocument<T extends IExtendedDocument>(this: Model<T>, id: string, field: string = "_id"): Promise<T | null> {
  try {
    let query = {};
    query[field || "_id"] = id;
    let doc = await this.findOne(query);
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
    let document = new this(data || {})//await this.create(data || {});

    document.initLocal();
    document.recalcDocument();
    //let message = await document.validateDocument();
    if (mode === "advanced") {
      // Zapisanie dokumentu do cache
      cache.set(document._id.toString(), document);
      return { document, saved: false };
    } else {
      await document.saveDocument();
      return { document, saved: true };
    }
  } catch (error) {
    throw error;
  }

}

export async function getDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, id: string, mode: string, field: string = "_id"): Promise<T | null> {
  try {

    let document: T | null = await this.loadDocument(id, field);
    if (document && document._id) {
      //const cacheID = new Types.ObjectId().toString();
      // to do - cacheID - jeżeli chcemy otwierać ten sam dokument w jedym momencie;
      if (mode === "advanced") cache.set(id, document);
    } else {
      if (!!this.defaultDocument) {
        return this.defaultDocument(id)
      }
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
export async function saveDocument<T extends IExtendedDocument>(this: Model<T>, id: string, data: Object): Promise<any> {
  try {
    let document = cache.get<T>(id);
    if (!document) {
      document = new this(data || {});
    } else {
      // to do - sprawdzić różnice 
    }

    await document.saveDocument();
    return { document_id: id, saved: true };
  } catch (error) {
    throw error;
  }
}

export interface updateBody {
  deepdoc?: string,
  deepdoc_id?: string,
  subdoc?: string,
  subdoc_id?: string,
  field: string,
  value: any,

}

export async function updateDocument<T extends IExtendedDocument>(this: IExtendedModel<T>, id: string, mode: string, field: string = "_id", updates: updateBody[] | updateBody) {
  try {
    let document: T | null | any | undefined = null;
    if (mode === "advanced") {
      document = cache.get<T | null>(id);
    } else {
      document = await this.loadDocument(id, field);
    }

    if (document) {
      if (!Array.isArray(updates)) updates = [updates]; // array
      for (let update of updates) {
        await document.setValue(update.field, update.value, update.subdoc, update.subdoc_id, update.deepdoc, update.deepdoc_id);
      }

      if (mode === "advanced") {
        document.recalcDocument();
        cache.set(id, document);
        return { document, saved: false };

      } else {
        await document.saveDocument();
        return { document, saved: true };
      }
    } else return { document: null, saved: false };
  } catch (error) {
    throw error;
  }
}

export async function getOptions<T extends IExtendedDocument>(this: IExtendedModel<T>, id: string, mode: string, field: any, page: number, keyword: string) {
  try {
    let document: T | null | any | undefined = null;
    if (id === "all") {
      document = new this();
    } else {
      if (mode === "advanced") {
        document = cache.get<T | null>(id);
      } else {
        document = await this.loadDocument(id);
      }
    }

    if (document) {

      let { results, total } = await document.getOptions(field.field, field.subdoc, field.subdoc_id, field.deepdoc, field.deepdoc_id, page, keyword, mode);

      return { results: results, total: total };

    } else return false;
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
      // to do - do sprawdzenia
      await document.validateVirtuals(true);
      await document.deleteOne();

      cache.del(id);
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

    if (select)
      for (const [key, value] of Object.entries(select)) {
        // to do - poprawić
        let fieldsSelect = { name: 1, resource: 1, type: 1 };
        let fields = key.split('.');
        if (fields.length > 1) {
          // sprawdza typ pola
          let field = docFields.find((field: any) => field.field == fields[0]);
          field = field.fields.find((field: any) => field.field == key);

          if (populated[fields[0]]) {
            populated[fields[0]].select[fields[1]] = 1;

            // jeżeli ref to dodaje do populate
            if (field && field.type) {
              populated[fields[0]].populate.push({
                path: fields[1],
                select: 'name resource type'
              })
            }
          } else {
            fieldsSelect[fields[1]] = 1;
            populated[fields[0]] = {
              path: fields[0],
              select: fieldsSelect,
              populate: []
            }
            if (field && field.type) {
              populated[fields[0]].populate.push({
                path: fields[1],
                select: 'name resource type'
              })
            }
          }
          delete select[key];
        } else {
          let field = docFields.find((field: any) => field.field == fields[0]);
          if (field && field.type) {
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




