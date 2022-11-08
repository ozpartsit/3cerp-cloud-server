// class TranTypes {
//   private elements: any[];
//   constructor() {
//     this.elements = [
//       { _id: "SalesOrder", name: "Sales Order" },
//       { _id: "Invoice", name: "Invoice" }
//     ];
//   }
//   public getEnum(): any[] {
//     return this.elements.map((element: any) => element._id);
//   }
//   public getProperties(_id: String): Object {
//     return this.elements.find((element: any) => element._id === _id) || {};
//   }
//   public getName(_id: String): String {
//     let element = this.elements.find((element: any) => element._id === _id);
//     return element ? element.name : "";
//   }
// }

// export default new TranTypes();
export default ["SalesOrder", "Invoice"];
