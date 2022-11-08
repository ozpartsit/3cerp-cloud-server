export default class DataCache {
  public cache: any = {};
  constructor() {
    console.log("init cache");
    this.cache = {};
    this.resetCache = this.resetCache.bind(this);
  }
  addCache(Document: any) {
    if (!this.getCache(Document._id)) {
      this.cache[Document._id] = Document;
    } else {
      //throw new Error("the document is now open!");
    }
  }
  getCache(DocumentID: any) {
    if (DocumentID) return this.cache[DocumentID];
    else return this.cache;
  }
  delCache(DocumentID: any) {
    if (DocumentID) delete this.cache[DocumentID];
  }
  getLength() {
    return Object.keys(this.cache).length;
  }
  resetCache() {
    this.cache = {};
  }
}
