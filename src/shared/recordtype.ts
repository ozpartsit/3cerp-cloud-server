import axios from "axios";
import currencies from "../constants/currencies";
//import { IUser } from "../models/user.model";
class Document {
  recordtype: string;
  collection: string;
  //_id: mongoose.Types.ObjectId;
  constructor(recordtype: string, collection: string, fields = {}) {
    //this._id = mongoose.Types.ObjectId();
    this.recordtype = recordtype;
    this.collection = collection;
    Object.assign(this, fields);
  }
}

export class Transaction extends Document {
  amount: number = 0;
  quantity: number = 0;
  weight: number = 0;
  exchangerate: number = 1;
  items: any[] = [];
  currency: any;
  date: Date;
  constructor(document: Document) {
    super(document.recordtype, document.collection);
    this.date = new Date();
    Object.assign(this, document);
    this.recalc();
  }
  set customer(obj: Entity) {
    this.customer = obj;
  }
  recalc() {
    //if (this.currency) this.currency = currencies[this.currency].name;

    if (this.items) {
      this.amount = 0;
      this.quantity = 0;
      this.weight = 0;
      this.items.forEach((line) => {
        this.quantity += line.quantity;
        this.weight += line.weight;
        line.amount = line.price * line.quantity;
        this.amount += line.amount;
      });
    }
    return this;
  }
  set status(status: string) {
    this.status = status;
  }
}

export class Entity extends Document {
  name: string = "";
  constructor(document: Document) {
    super(document.recordtype, document.collection);
    Object.assign(this, document);
  }
  set fullName(v: string) {
    this.name = v;
  }
}

export class Item extends Document {
  name: string = "";
  constructor(document: Document) {
    super(document.recordtype, document.collection);
    Object.assign(this, document);
  }
}
