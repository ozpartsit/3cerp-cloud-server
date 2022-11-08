// class TranLineTypes {
//   private elements: any[];
//   constructor() {
//     this.elements = [
//       { _id: "Items", name: "Items" },
//       { _id: "ShippingItem", name: "Shipping Item" },
//       { _id: "KitComponent", name: "Kit Component" }
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

// export default new TranLineTypes();
export default ["Items", "ShippingItem", "KitComponent"];
