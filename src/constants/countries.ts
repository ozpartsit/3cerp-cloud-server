// class Countries {
//   private elements: any[];
//   constructor() {
//     this.elements = [
//       { _id: "PL", name: "Poland", currency: "PLN", flag: "🇵🇱" },
//       { _id: "GB", name: "United Kingdom", currency: "GBP", flag: "🇬🇧" }
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

// export default new Countries();
export default ["PL", "GB"];
