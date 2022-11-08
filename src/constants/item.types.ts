// class ItemTypes {
//   private elements: any[];
//   constructor() {
//     this.elements = [
//       { _id: "InvItem", name: "Invenory Item" },
//       { _id: "KitItem", name: "Kit Item" },
//       { _id: "Service", name: "Service" },
//       { _id: "ShippingItem", name: "Shipping Method" }
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

// export default new ItemTypes();
export default ["InvItem", "KitItem", "Service", "ShippingItem"];
